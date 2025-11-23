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

