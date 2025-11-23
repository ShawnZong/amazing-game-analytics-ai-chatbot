/**
 * LangChain Agent Setup
 * 
 * This module creates and manages the LangChain agent with:
 * - ConversationBufferMemory (keyed by sessionId)
 * - AgentExecutor with tools
 * - System prompt configuration
 */

import { AgentExecutor, createToolCallingAgent } from "langchain/agents";
import { BufferMemory } from "langchain/memory";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { DEFAULT_SYSTEM_PROMPT } from "./constants";
import { Message } from "./types";
import { HumanMessage, AIMessage, SystemMessage } from "@langchain/core/messages";

/**
 * In-memory session storage for conversation history
 * In production, consider using Cloudflare KV or Durable Objects
 * 
 * TODO: For production deployment
 * - Replace with Cloudflare KV for persistent storage across worker instances
 * - Or use Durable Objects for stateful, long-lived sessions
 * - Add session expiration and cleanup
 */
const sessionMemories = new Map<string, BufferMemory>();

/**
 * Get or create memory for a session
 * 
 * @param sessionId - Unique session identifier
 * @returns BufferMemory instance for the session
 */
function getSessionMemory(sessionId: string): BufferMemory {
  if (!sessionMemories.has(sessionId)) {
    sessionMemories.set(
      sessionId,
      new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      })
    );
  }
  return sessionMemories.get(sessionId)!;
}

/**
 * Clear memory for a session
 * Useful for starting a new conversation
 * 
 * @param sessionId - Session to clear
 */
export function clearSessionMemory(sessionId: string): void {
  sessionMemories.delete(sessionId);
}

/**
 * Convert our Message format to LangChain messages
 * 
 * @param messages - Array of messages from the API request
 * @returns Array of LangChain message objects
 */
function convertMessages(messages: Message[]) {
  return messages.map((msg) => {
    switch (msg.role) {
      case "system":
        return new SystemMessage(msg.content);
      case "user":
        return new HumanMessage(msg.content);
      case "assistant":
        return new AIMessage(msg.content);
      default:
        return new HumanMessage(msg.content);
    }
  });
}

/**
 * Create a chat prompt template with system message and chat history
 */
function createPromptTemplate(): ChatPromptTemplate {
  return ChatPromptTemplate.fromMessages([
    ["system", DEFAULT_SYSTEM_PROMPT],
    new MessagesPlaceholder("chat_history"),
    ["human", "{input}"],
    new MessagesPlaceholder("agent_scratchpad"),
  ]);
}

/**
 * Create an AgentExecutor instance
 * 
 * @param model - Chat model (MockChatModel or ChatOpenAI)
 * @param tools - Array of tools available to the agent
 * @param sessionId - Session identifier for memory
 * @returns AgentExecutor instance
 */
export async function createAgent(
  model: BaseChatModel,
  tools: DynamicStructuredTool[],
  sessionId: string
): Promise<AgentExecutor> {
  const memory = getSessionMemory(sessionId);
  const prompt = createPromptTemplate();

  // Create the tool-calling agent
  const agent = await createToolCallingAgent({
    llm: model,
    tools,
    prompt,
  });

  // Create the executor
  const executor = new AgentExecutor({
    agent,
    tools,
    memory,
    verbose: true, // Enable logging for debugging
    maxIterations: 5, // Prevent infinite loops
    returnIntermediateSteps: true, // Include tool usage in response
  });

  return executor;
}

/**
 * Execute the agent with a conversation
 * 
 * @param model - Chat model
 * @param tools - Available tools
 * @param sessionId - Session identifier
 * @param messages - Conversation history
 * @returns Agent response with tool usage information
 */
export async function executeAgent(
  model: BaseChatModel,
  tools: DynamicStructuredTool[],
  sessionId: string,
  messages: Message[]
): Promise<{
  reply: string;
  toolsUsed: Array<{ name: string; result: any }>;
}> {
  // Get the last user message as input
  const lastUserMessage = messages
    .filter((m) => m.role === "user")
    .pop();

  if (!lastUserMessage) {
    throw new Error("No user message found in conversation");
  }

  // Create agent executor
  const executor = await createAgent(model, tools, sessionId);

  // Save previous messages to memory (excluding the last user message)
  const memory = getSessionMemory(sessionId);
  const previousMessages = messages.slice(0, -1);
  
  // Clear existing memory and add all messages
  await memory.clear();
  for (const msg of previousMessages) {
    if (msg.role === "user") {
      await memory.chatHistory.addMessage(new HumanMessage(msg.content));
    } else if (msg.role === "assistant") {
      await memory.chatHistory.addMessage(new AIMessage(msg.content));
    }
  }

  // Execute the agent
  const result = await executor.invoke({
    input: lastUserMessage.content,
  });

  // Extract tool usage from intermediate steps
  const toolsUsed: Array<{ name: string; result: any }> = [];
  if (result.intermediateSteps) {
    for (const step of result.intermediateSteps) {
      if (step.action && step.observation) {
        toolsUsed.push({
          name: step.action.tool,
          result: step.observation,
        });
      }
    }
  }

  return {
    reply: result.output,
    toolsUsed,
  };
}

