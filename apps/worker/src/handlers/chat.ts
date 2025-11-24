/**
 * Chat endpoint handler
 */

import { ChatRequestSchema, ChatResponse, Env } from '../lib/types';
import { ERROR_CODES, HTTP_STATUS } from '../lib/constants';
import { createChatModel, getModelInfo } from '../llm/model-factory';
import { createAllTools } from '../tools';
import { executeAgent } from '../llm/agent';
import { jsonResponse, errorResponse } from '../lib/response';
import { logger } from '../lib/logger';

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

    const { messages } = validation.data;

    logger.info('Processing chat request', { messageCount: messages.length });
    logger.debug('Model info', { model: getModelInfo(env) });

    // Create chat model
    const model = createChatModel(env);

    // Create tools that connect to MCP server via HTTP
    // @langchain/mcp-adapters handles HTTP/SSE automatically - no fetch override needed
    const tools = await createAllTools(env);

    logger.debug('Available tools', {
      toolCount: tools.length,
      toolNames: tools.map(t => t.name),
    });

    // Execute the agent
    // Tools will make standard HTTP requests to the MCP server
    const result = await executeAgent(model, tools, messages);

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
      logger.info('Tools used in response', {
        toolCount: result.toolsUsed.length,
      });
    }

    logger.info('Chat response generated successfully');
    return jsonResponse(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for OpenAI quota/rate limit errors
    const isQuotaError =
      errorMessage.includes('429') ||
      errorMessage.includes('quota') ||
      errorMessage.includes('InsufficientQuotaError') ||
      errorMessage.includes('rate limit') ||
      errorMessage.includes('RATE_LIMIT');

    if (isQuotaError) {
      logger.error('OpenAI quota/rate limit exceeded', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });

      return errorResponse(
        ERROR_CODES.MODEL_ERROR,
        'OpenAI API quota exceeded. Please check your billing and quota settings at https://platform.openai.com/account/billing',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    logger.error('Error handling chat request', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Don't expose internal error details to client
    return errorResponse(
      ERROR_CODES.INTERNAL_ERROR,
      'An internal error occurred while processing your request',
    );
  }
}
