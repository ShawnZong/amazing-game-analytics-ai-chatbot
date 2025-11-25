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
 * System prompt for the condensing node
 */
const CONDENSER_SYSTEM_PROMPT = `You are a response condenser for a video game analytics assistant. Your job is to condense the final response to be within 600 words while preserving all essential information and ensuring confidence and trustworthiness.

Condensing rules:
- **ALWAYS preserve the entire Calculations section** - never remove or shorten calculation details, formulas, or mathematical steps
- **Remove all N/A, null, undefined, uncertain, unknown, or speculative information** - only include verified data and confident conclusions
- **Remove disclaimers about missing data or limitations** - present only what is known with certainty
- Keep all data tables and key metrics that are verified
- **Include images/pictures when available from RAWG data** - if the fetched data contains image URLs (screenshots, artwork, logos), include them in markdown format using ![alt text](image_url)
- Maintain the Analysis Report structure (Data Retrieved, Calculations, Findings, Implications, Bonus Commentary)
- Remove redundant explanations and verbose descriptions
- Keep the energetic, fun tone and emojis
- Ensure the condensed response is confident, trustworthy, and actionable
- Use definitive language - avoid phrases like "might be", "could be", "possibly", "uncertain", "unknown"
- Target: maximum 600 words total

Return only the condensed response in the same markdown format, presenting only verified information with confidence.`;

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
 * Creates LLM node function
 */
function createLlmNode(modelWithTools: ReturnType<ChatOpenAI['bindTools']>) {
  return async (state: typeof MessagesAnnotation.State) => {
    const response = await modelWithTools.invoke(state.messages);
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
    if (!lastAI || !AIMessage.isInstance(lastAI)) {
      return {}; // nothing to condense
    }

    const originalContent =
      typeof lastAI.content === 'string' ? lastAI.content : String(lastAI.content);

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

  // Build graph: START -> refiner -> llm -> maybe tools -> llm -> condense -> END
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode('refiner', refinerNode)
    .addNode('llm', llmNode)
    .addNode('tools', toolNode)
    .addNode('condense', condenseNode)
    .addEdge(START, 'refiner')
    .addEdge('refiner', 'llm')
    .addEdge('tools', 'llm')
    .addConditionalEdges('llm', state => {
      const lastMessage = state.messages.at(-1);
      if (AIMessage.isInstance(lastMessage) && lastMessage.tool_calls?.length) {
        return 'tools';
      }
      return 'condense';
    })
    .addEdge('condense', END);

  return workflow.compile();
}
