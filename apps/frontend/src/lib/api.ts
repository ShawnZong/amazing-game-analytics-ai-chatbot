/**
 * API client for communicating with the backend worker
 *
 * Calls Next.js API route which handles service bindings server-side
 */

import type { ChatRequest, ChatResponse, ErrorResponse, WorkerMessage } from '@/types/chat';

/**
 * Send a chat message to the backend worker via Next.js API route
 *
 * The API route handles Cloudflare service bindings server-side, avoiding
 * client-side errors when getCloudflareContext() is called.
 *
 * @param sessionId - Unique session identifier
 * @param messages - Array of messages in worker format
 * @returns Promise resolving to chat response
 * @throws Error if request fails
 */
export async function sendChatMessage(
  sessionId: string,
  messages: WorkerMessage[],
): Promise<ChatResponse> {
  const requestBody: ChatRequest = {
    sessionId,
    messages,
  };

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = data as ErrorResponse;
      throw new Error(error.message || `Request failed with status ${response.status}`);
    }

    return data as ChatResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to send chat message');
  }
}
