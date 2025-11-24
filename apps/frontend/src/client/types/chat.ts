export type Role = 'user' | 'assistant';

/**
 * Frontend message format for UI components
 * Note: AI SDK messages have a different format with parts array
 */
export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: Date;
}
