/**
 * LangGraph Agent Setup
 *
 * This module creates and manages the LangChain agent using LangGraph:
 * - Uses StateGraph with MessagesAnnotation
 * - Stateless agent (no session management)
 * - Integrates with MCP tools via @langchain/mcp-adapters
 */

import { AIMessage, HumanMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { ChatOpenAI } from '@langchain/openai';
import { DEFAULT_SYSTEM_PROMPT } from '../lib/constants';
import { Message } from '../lib/types';
/**
 * Convert our Message format to LangChain messages
 */
function convertToLangChainMessages(messages: Message[]) {
  return messages.map(msg => {
    switch (msg.role) {
      case 'system':
        return new SystemMessage(msg.content);
      case 'user':
        return new HumanMessage(msg.content);
      case 'assistant':
        return new AIMessage(msg.content);
      default:
        return new HumanMessage(msg.content);
    }
  });
}

/**
 * Execute the agent with a conversation using LangGraph
 *
 * @param model - Chat model (ChatOpenAI)
 * @param tools - Available tools from MCP server
 * @param messages - Conversation history
 * @returns Agent response with tool usage information
 */
export async function executeAgent(
  model: ChatOpenAI,
  tools: StructuredToolInterface[],
  messages: Message[],
): Promise<{
  reply: string;
  toolsUsed: Array<{ name: string; result: unknown }>;
}> {
  // Convert messages to LangChain format, prepending system message
  const langChainMessages = [
    new SystemMessage(DEFAULT_SYSTEM_PROMPT),
    ...convertToLangChainMessages(messages),
  ];

  // Bind tools to the model
  const modelWithTools = model.bindTools(tools);

  // Create tool node for executing tools
  const toolNode = new ToolNode(tools);

  // Define the LLM node function
  const llmNode = async (state: typeof MessagesAnnotation.State) => {
    const { messages } = state;
    const response = await modelWithTools.invoke(messages);
    return { messages: [response] };
  };

  // Create the LangGraph workflow
  const workflow = new StateGraph(MessagesAnnotation)
    // Add nodes
    .addNode('llm', llmNode)
    .addNode('tools', toolNode)
    // Add edges
    .addEdge(START, 'llm')
    .addEdge('tools', 'llm')
    // Conditional routing based on tool calls
    .addConditionalEdges('llm', state => {
      const lastMessage = state.messages[state.messages.length - 1];
      const aiMessage = lastMessage as AIMessage;

      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        return 'tools';
      }

      return END;
    });

  // Compile the graph
  const app = workflow.compile();

  // Execute the workflow
  const result = await app.invoke({
    messages: langChainMessages,
  });

  // Extract the final response
  const finalMessage = result.messages[result.messages.length - 1];
  const reply = finalMessage?.content || '';
  const replyText = typeof reply === 'string' ? reply : JSON.stringify(reply);

  // Extract tool usage from messages
  const toolsUsed: Array<{ name: string; result: unknown }> = [];
  for (const msg of result.messages) {
    if (msg instanceof ToolMessage) {
      toolsUsed.push({
        name: msg.name || 'unknown',
        result: msg.content,
      });
    }
  }

  return {
    reply: replyText,
    toolsUsed,
  };
}
