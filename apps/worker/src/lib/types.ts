import { z } from 'zod';

/**
 * Environment bindings for Cloudflare Worker
 */
export interface Env {
  OPENAI_API_KEY?: string;
  MCP_SERVER_URL: string;
  DEFAULT_MODEL?: string;
  MAX_TOKENS?: string;
  TEMPERATURE?: string;
}

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
  sessionId: z.string().min(1).optional(),
  messages: z.array(MessageSchema).min(1),
});
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
