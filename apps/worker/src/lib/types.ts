import { z } from 'zod';

/**
 * Request/Response schemas for POST /chat endpoint
 */

// Message role types
export const MessageRoleSchema = z.enum(['system', 'user', 'assistant']);
export type MessageRole = z.infer<typeof MessageRoleSchema>;

// Individual message
export const MessageSchema = z.object({
  role: MessageRoleSchema,
  content: z.string(),
});
export type Message = z.infer<typeof MessageSchema>;

// Chat request
export const ChatRequestSchema = z.object({
  sessionId: z.string().min(1),
  messages: z.array(MessageSchema).min(1),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;

// Tool result
export const ToolResultSchema = z.object({
  name: z.string(),
  result: z.unknown(), // Use unknown instead of any for better type safety
});
export type ToolResult = z.infer<typeof ToolResultSchema>;

// Chat response
export const ChatResponseSchema = z.object({
  reply: z.string(),
  tools: z.array(ToolResultSchema).optional(),
});
export type ChatResponse = z.infer<typeof ChatResponseSchema>;

// Error response
export const ErrorResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

/**
 * Environment bindings for Cloudflare Worker
 */
export interface Env {
  OPENAI_API_KEY?: string;
  MCP_SERVER_URL: string; // HTTP URL to MCP server (used by @langchain/mcp-adapters)
  DEFAULT_MODEL?: string;
  MAX_TOKENS?: string;
  TEMPERATURE?: string;
}
