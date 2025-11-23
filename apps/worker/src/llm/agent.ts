/**
 * LangChain Agent Setup (v1.0 pattern)
 * 
 * This module creates and manages the LangChain agent using the v1.0 API:
 * - Uses createAgent from langchain package
 * - Manages conversation history per session
 * - Integrates with MCP tools via @langchain/mcp-adapters
 */

import { createAgent } from 'langchain';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { DEFAULT_SYSTEM_PROMPT } from '../lib/constants';
import { Message } from '../lib/types';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';

/**
 * In-memory session storage for conversation history
 * In production, consider using Cloudflare KV or Durable Objects
 * 
 * Note: This will be lost on worker restart. For production, use persistent storage.
 */
const sessionHistories = new Map<string, Message[]>();

/**
 * Get or create conversation history for a session
 * 
 * @param sessionId - Unique session identifier
 * @returns Array of messages for the session
 */
function getSessionHistory(sessionId: string): Message[] {
  if (!sessionHistories.has(sessionId)) {
    sessionHistories.set(sessionId, []);
  }
  return sessionHistories.get(sessionId)!;
}

/**
 * Clear conversation history for a session
 */
export function clearSessionMemory(sessionId: string): void {
  sessionHistories.delete(sessionId);
}

/**
 * Convert our Message format to LangChain messages
 */
function convertToLangChainMessages(messages: Message[]) {
  return messages.map((msg) => {
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
 * Execute the agent with a conversation
 * 
 * @param model - Chat model (MockChatModel or ChatOpenAI)
 * @param tools - Available tools from MCP server
 * @param sessionId - Session identifier
 * @param messages - Conversation history
 * @returns Agent response with tool usage information
 */
export async function executeAgent(
  model: BaseChatModel,
  tools: StructuredToolInterface[],
  sessionId: string,
  messages: Message[]
): Promise<{
  reply: string;
  toolsUsed: Array<{ name: string; result: unknown }>;
}> {
  // Get the last user message
  const lastUserMessage = messages.filter((m) => m.role === 'user').pop();

  if (!lastUserMessage) {
    throw new Error('No user message found in conversation');
  }

  // Get session history and update it
  const sessionHistory = getSessionHistory(sessionId);
  
  // Convert messages to LangChain format, prepending system message
  const langChainMessages = [
    new SystemMessage(DEFAULT_SYSTEM_PROMPT),
    ...convertToLangChainMessages(messages),
  ];

  // Create agent using LangChain v1 pattern
  // The agent automatically handles tool calling and conversation flow
  const agent = await createAgent({
    model,
    tools,
  });

  // Execute the agent
  const result = await agent.invoke({
    messages: langChainMessages,
  });

  // Extract the response text
  const reply = result.messages[result.messages.length - 1]?.content || '';

  // Update session history
  sessionHistory.push(...messages);
  if (sessionHistory.length > 50) {
    // Keep only last 50 messages to prevent memory bloat
    sessionHistory.splice(0, sessionHistory.length - 50);
  }

  // Extract tool usage from messages
  const toolsUsed: Array<{ name: string; result: unknown }> = [];
  for (const msg of result.messages) {
    if (msg._getType() === 'tool') {
      // Tool messages contain tool results
      // Type assertion needed because LangChain tool messages don't expose name in types
      const toolMsg = msg as { name?: string; content: unknown };
      toolsUsed.push({
        name: toolMsg.name || 'unknown',
        result: toolMsg.content,
      });
    }
  }

  return {
    reply: typeof reply === 'string' ? reply : JSON.stringify(reply),
    toolsUsed,
  };
}
