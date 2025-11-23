export type Role = 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}

/**
 * API request/response types matching worker schema
 */

// Worker message format (without id and createdAt)
export interface WorkerMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Chat request to worker
export interface ChatRequest {
  sessionId: string;
  messages: WorkerMessage[];
}

// Chat response from worker
export interface ChatResponse {
  reply: string;
  tools?: Array<{
    name: string;
    result: unknown;
  }>;
}

// Error response from worker
export interface ErrorResponse {
  code: string;
  message: string;
}
