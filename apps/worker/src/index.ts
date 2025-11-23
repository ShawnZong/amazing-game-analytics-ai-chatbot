/**
 * Cloudflare Worker - RAWG Analytics LLM Backend
 *
 * This worker provides a POST /chat endpoint that:
 * 1. Receives user messages
 * 2. Processes them through a LangChain agent
 * 3. Connects to MCP server for game data tools
 * 4. Returns AI responses with optional tool usage
 *
 * MVP Features:
 * - One-shot JSON responses (no streaming)
 * - Mock chat model by default
 * - Switches to GPT-4 when OPENAI_API_KEY is provided
 * - Session-based conversation memory
 */

import { Env } from './lib/types';
import { ERROR_CODES, HTTP_STATUS } from './lib/constants';
import { handleOptions, errorResponse } from './lib/response';
import { handleRoot } from './handlers/root';
import { handleChat } from './handlers/chat';

/**
 * Main Worker fetch handler
 */
const worker: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route handlers
    try {
      if (path === '/' && request.method === 'GET') {
        return handleRoot(env);
      }

      if (path === '/chat' && request.method === 'POST') {
        return await handleChat(request, env);
      }

      // 404 for unknown routes
      return errorResponse('NOT_FOUND', `Route ${path} not found`, HTTP_STATUS.NOT_FOUND);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Unhandled error:', errorMessage, error);
      return errorResponse(ERROR_CODES.INTERNAL_ERROR, 'An unexpected error occurred');
    }
  },
};

export default worker;
