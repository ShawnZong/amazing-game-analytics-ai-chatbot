/**
 * Chat endpoint handler
 */

import { ChatRequestSchema, ChatResponse, Env } from '../lib/types';
import { ERROR_CODES, HTTP_STATUS } from '../lib/constants';
import { createChatModel, getModelInfo } from '../llm/model-factory';
import { createAllTools } from '../tools';
import { executeAgent } from '../llm/agent';
import { jsonResponse, errorResponse } from '../lib/response';

/**
 * Handle POST /chat endpoint
 */
export async function handleChat(request: Request, env: Env): Promise<Response> {
  try {
    // Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        'Content-Type must be application/json',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      return errorResponse(
        ERROR_CODES.VALIDATION_ERROR,
        'Invalid JSON in request body',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

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

    // Create tools that connect to MCP server (now async)
    const tools = await createAllTools(env);

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling chat request:', errorMessage, error);

    // Don't expose internal error details to client
    return errorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      'An internal error occurred while processing your request',
    );
  }
}

