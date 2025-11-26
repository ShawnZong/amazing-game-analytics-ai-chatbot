/**
 * LangGraph workflow creation
 */
import type { BaseMessage } from '@langchain/core/messages';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { CONDENSER_SYSTEM_PROMPT, REFINER_SYSTEM_PROMPT, SYSTEM_PROMPT } from './prompts';

/**
 * Creates refiner node function
 */
function createRefinerNode(model: ChatOpenAI) {
  return async (state: typeof MessagesAnnotation.State) => {
    // find last user message (works with plain messages array)
    const lastUser = [...state.messages].reverse().find(m => HumanMessage.isInstance(m));
    if (!lastUser) return {}; // nothing to refine

    // Ask the model to rewrite the user's input to be clearer for video game analytics queries
    const prompt = [
      {
        role: 'system',
        content: REFINER_SYSTEM_PROMPT,
      },
      { role: 'user', content: lastUser.content },
    ];

    const rewriteResponse = await model.invoke(prompt); // uses model without tools
    console.log('LLM rewriteResponse', { rewriteResponse });
    // append a new user message with the refined content so downstream nodes see it
    // note: using a plain message object {role, content} matches the patterns used elsewhere
    return { messages: [{ role: 'user', content: rewriteResponse.content }] };
  };
}

/**
 * Ensures the system prompt is always present and first in the messages array.
 * This guarantees that the LLM always receives the correct system instructions,
 * even if previous nodes in the workflow modified the messages array.
 *
 * @param messages - The current messages array from the workflow state
 * @returns Messages array with SYSTEM_PROMPT guaranteed to be first
 */
function ensureSystemPrompt(messages: BaseMessage[]): BaseMessage[] {
  // Check if first message is already a SystemMessage with SYSTEM_PROMPT
  const firstMessage = messages[0];
  if (SystemMessage.isInstance(firstMessage) && firstMessage.content === SYSTEM_PROMPT) {
    return messages; // System prompt already present and correct
  }

  // Filter out any existing system messages to avoid duplicates
  const nonSystemMessages = messages.filter(msg => !SystemMessage.isInstance(msg));

  // Prepend the system prompt as the first message
  return [new SystemMessage(SYSTEM_PROMPT), ...nonSystemMessages];
}

/**
 * Maximum number of tool call iterations allowed to prevent infinite loops and excessive token usage
 */
const MAX_TOOL_ITERATIONS = 30;

/**
 * Counts the number of tool call rounds (llm -> tools -> llm cycles)
 * This helps prevent infinite loops and excessive token consumption
 */
function countToolIterations(messages: BaseMessage[]): number {
  let iterations = 0;
  for (const msg of messages) {
    if (AIMessage.isInstance(msg) && msg.tool_calls?.length) {
      iterations++;
    }
  }
  return iterations;
}

/**
 * Creates LLM node function that ensures the system prompt is always present.
 * This makes the system prompt usage explicit in the workflow and guarantees
 * it's always available to the LLM, even if previous nodes modified messages.
 */
function createLlmNode(modelWithTools: ReturnType<ChatOpenAI['bindTools']>) {
  return async (state: typeof MessagesAnnotation.State) => {
    // Ensure system prompt is always present and first
    const messagesWithSystemPrompt = ensureSystemPrompt(state.messages);
    const response = await modelWithTools.invoke(messagesWithSystemPrompt);
    console.log('LLM response', { response });
    return { messages: [response] };
  };
}

/**
 * Creates condensing node function
 */
function createCondenseNode(model: ChatOpenAI) {
  return async (state: typeof MessagesAnnotation.State) => {
    // Find the last AI message (the final response)
    const lastAI = [...state.messages].reverse().find(m => AIMessage.isInstance(m));

    // If no AI message exists, generate a response based on available data
    if (!lastAI || !AIMessage.isInstance(lastAI)) {
      console.warn(
        'No AI message found for condensing, generating final response from available data',
      );

      // Find the last user message to understand the query
      const lastUser = [...state.messages].reverse().find(m => HumanMessage.isInstance(m));
      const userQuery =
        lastUser && HumanMessage.isInstance(lastUser) ? lastUser.content : 'the query';

      // Generate a response acknowledging the situation
      const prompt = [
        {
          role: 'system',
          content: CONDENSER_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Generate a comprehensive analysis report for: "${userQuery}". Based on the available data collected, provide insights and analysis. If data collection was incomplete, clearly state the limitations. Structure as an Analysis Report with: Data Retrieved, Calculations, Findings, and Implications sections.`,
        },
      ];

      const response = await model.invoke(prompt);
      return { messages: [new AIMessage(response.content)] };
    }

    const originalContent =
      typeof lastAI.content === 'string' ? lastAI.content : String(lastAI.content);

    // If the content is empty or very short, don't condense, just return as-is
    if (!originalContent || originalContent.trim().length < 50) {
      console.warn('AI message content too short to condense, returning as-is');
      return { messages: [lastAI] };
    }

    // Ask the model to condense the response
    const prompt = [
      {
        role: 'system',
        content: CONDENSER_SYSTEM_PROMPT,
      },
      {
        role: 'user',
        content: `Please condense the following response to within 600 words while preserving the entire Calculations section:\n\n${originalContent}`,
      },
    ];

    const condensedResponse = await model.invoke(prompt); // uses model without tools
    console.log('LLM condensedResponse', { condensedResponse });
    // Replace the last AI message with the condensed version
    return { messages: [new AIMessage(condensedResponse.content)] };
  };
}

/**
 * Creates LangGraph workflow for agent execution
 */
export function createWorkflow(model: ChatOpenAI, tools: StructuredToolInterface[]) {
  const modelWithTools = model.bindTools(tools);
  const toolNode = new ToolNode(tools);

  const refinerNode = createRefinerNode(model);
  const llmNode = createLlmNode(modelWithTools);
  const condenseNode = createCondenseNode(model);

  // Build graph: START -> refiner -> llm -> (loop: tools -> llm) -> condense -> END
  // The loop allows multiple tool calls: llm can call tools, then llm again, then tools again, etc.
  // This enables the LLM to fetch more data if it can't find some data in the first round.
  // LangGraph will continue looping until the LLM stops making tool calls.
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('refiner', refinerNode)
    .addNode('llm', llmNode)
    .addNode('tools', toolNode)
    .addNode('condense', condenseNode)
    .addEdge(START, 'refiner')
    .addEdge('refiner', 'llm')
    .addEdge('tools', 'llm') // Loop back to llm after tools execute - enables multiple tool call rounds
    .addConditionalEdges('llm', state => {
      const lastMessage = state.messages.at(-1);
      const toolIterations = countToolIterations(state.messages);

      // Check if we've exceeded the maximum iterations to prevent infinite loops and excessive token usage
      if (toolIterations >= MAX_TOOL_ITERATIONS) {
        console.warn(
          `Maximum tool iterations (${MAX_TOOL_ITERATIONS}) reached. Forcing workflow to condense and end to prevent excessive token usage.`,
        );
        // Force termination to prevent infinite loops
        // Even if there are tool calls, we stop here and generate a final response
        return 'condense';
      }

      // If we have tool calls, continue to tools node
      if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
        console.log(
          `Tool calls detected (${lastMessage.tool_calls.length} calls, iteration ${toolIterations + 1}/${MAX_TOOL_ITERATIONS}), routing to tools node for execution`,
        );
        return 'tools';
      }

      // No tool calls - generate final response
      // Check if we have at least one AI message with content
      const hasAIContent = state.messages.some(
        msg =>
          AIMessage.isInstance(msg) &&
          msg.content &&
          (typeof msg.content === 'string' ? msg.content.trim().length > 0 : true),
      );

      if (!hasAIContent) {
        console.warn('No AI content found, but no tool calls - forcing a response generation');
        // This shouldn't happen, but if it does, we'll let condense node handle it
      }

      console.log(
        `No tool calls detected (completed ${toolIterations} iterations), routing to condense node for final response`,
      );
      return 'condense';
    })
    .addEdge('condense', END);

  // Compile the workflow - LangGraph will automatically handle the loop
  // The workflow will continue until the LLM stops making tool calls
  return workflow.compile();
}
