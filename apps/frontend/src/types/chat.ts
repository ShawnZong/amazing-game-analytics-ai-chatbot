/**
 * Chat types
 * 
 * Re-exports types from the shared package for convenience.
 * The shared package (@rawg-analytics/shared) is the source of truth for all API types.
 */

export type { ChatMessage, ChatRequest, ChatResponse, MessageRole } from "@rawg-analytics/shared/types";

// Legacy interface with additional UI-specific properties
export interface Message {
  id?: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: Date;
}
