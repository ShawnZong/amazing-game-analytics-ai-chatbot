/**
 * LangGraph workflow creation
 */
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';

/**
 * System prompt for the message refiner node
 */
const REFINER_SYSTEM_PROMPT = `You are a message refiner for a video game analytics assistant powered by the RAWG API. Your job is to rewrite the user's message to be clear, specific, and optimized for game analytics queries.

Refine the user's message by:
- Making vague questions more specific (e.g., "games" → "action games released in 2024")
- Clarifying ambiguous terms (e.g., "recent games" → "games released in the last 6 months")
- Preserving the user's original intent and meaning
- Ensuring date ranges are explicit when time periods are mentioned
- Making queries actionable for game data retrieval and analysis tools
- Keeping the refined message concise and unambiguous

Return only the refined user message, maintaining their original tone and intent.`;

/**
 * Creates LangGraph workflow for agent execution
 */

// keep your existing createWorkflow signature
export function createWorkflow(model: ChatOpenAI, tools: StructuredToolInterface[]) {
  const modelWithTools = model.bindTools(tools);
  const toolNode = new ToolNode(tools);

  // 1) Refiner node: call the raw model to rewrite/refine the user's last message
  const refinerNode = async (state: typeof MessagesAnnotation.State) => {
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

  // 2) Existing LLM node (calls modelWithTools so it can optionally call tools)
  const llmNode = async (state: typeof MessagesAnnotation.State) => {
    const response = await modelWithTools.invoke(state.messages);
    console.log('LLM response', { response });
    return { messages: [response] };
  };

  // Build graph: START -> refiner -> llm -> maybe tools -> llm loop ...
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('refiner', refinerNode)
    .addNode('llm', llmNode)
    .addNode('tools', toolNode)
    .addEdge(START, 'refiner')
    .addEdge('refiner', 'llm')
    .addEdge('tools', 'llm')
    .addConditionalEdges('llm', state => {
      const lastMessage = state.messages.at(-1);
      if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
        return 'tools';
      }
      return END;
    });

  return workflow.compile();
}
