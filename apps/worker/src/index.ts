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

import { ChatRequestSchema, ChatResponse, ErrorResponse, Env } from './types';
import { ERROR_CODES, HTTP_STATUS } from './constants';
import { createChatModel, getModelInfo } from './model-factory';
import { createAllTools } from './langchain-tools';
import { executeAgent } from './agent';

/**
 * CORS headers for cross-origin requests
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Create a JSON response with CORS headers
 */
function jsonResponse(
  data: ChatResponse | ErrorResponse,
  status: number = HTTP_STATUS.OK,
): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Create an error response
 */
function errorResponse(
  code: string,
  message: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response {
  const error: ErrorResponse = { code, message };
  return jsonResponse(error, status);
}

/**
 * Handle POST /chat endpoint
 */
async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        `Invalid request: ${validation.error.message}`,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    const { sessionId, messages } = validation.data;

    console.log(`Processing chat request for session: ${sessionId}`);
    console.log(`Model info:`, getModelInfo(env));

    // Create chat model (mock or GPT-4 based on env)
    const model = createChatModel(env);

    // Create tools that connect to MCP server
    const tools = createAllTools(env);

    console.log(`Available tools: ${tools.map(t => t.name).join(', ')}`);

    // Execute the agent
    const result = await executeAgent(model, tools, sessionId, messages);

    // Build response
    const response: ChatResponse = {
      reply: result.reply,
    };

    // Include tool usage if any tools were called
    if (result.toolsUsed.length > 0) {
      response.tools = result.toolsUsed.map(tool => ({
        name: tool.name,
        result: tool.result,
      }));
    }

    console.log(`Chat response generated successfully`);
    return jsonResponse(response);
  } catch (error) {
    console.error('Error handling chat request:', error);

    // Don't expose internal error details to client
    return errorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      'An internal error occurred while processing your request',
    );
  }
}

/**
 * Handle GET / endpoint (health check / info)
 */
function handleRoot(env: Env): Response {
  const info = {
    service: 'RAWG Analytics LLM Worker',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /chat',
    },
    model: getModelInfo(env),
    status: 'operational',
  };

  return jsonResponse(info as any);
}

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
      return errorResponse('NOT_FOUND', `Route ${path} not found`, 404);
    } catch (error) {
      console.error('Unhandled error:', error);
      return errorResponse(ERROR_CODES.INTERNAL_ERROR, 'An unexpected error occurred');
    }
  },
};

export default worker;
