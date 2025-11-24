/**
 * Chat API handler logic
 */

import { getMcpTools } from '@/server/lib/chat/mcp-client';
import { convertToLangChainMessages, extractReply } from '@/server/lib/chat/messages';
import { createModel } from '@/server/lib/chat/model';
import { createWorkflow } from '@/server/lib/chat/workflow';
import type { Env } from '@/server/types/env';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { config } from 'dotenv';
import { resolve } from 'path';
import { z } from 'zod';

// AI SDK message format schema
const AISDKMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const AISDKRequestSchema = z.object({
  messages: z.array(AISDKMessageSchema),
});

/**
 * Gets environment variables from Cloudflare context or falls back to process.env for local development
 */
function getEnv(): Env {
  const context = getCloudflareContext();
  const cloudflareEnv = context.env as unknown as Record<string, string | undefined>;
  // If Cloudflare context is available, use it with proper type handling
  if (cloudflareEnv && cloudflareEnv.OPENAI_API_KEY) {
    console.log('Loading environment variables from Cloudflare context');
    return {
      OPENAI_API_KEY: cloudflareEnv.OPENAI_API_KEY,
      MCP_SERVER_URL: `${cloudflareEnv.MCP_SERVER_URL ?? 'http://localhost:8787'}/mcp`,
      DEFAULT_MODEL: cloudflareEnv.DEFAULT_MODEL,
      MAX_TOKENS: cloudflareEnv.MAX_TOKENS,
      TEMPERATURE: cloudflareEnv.TEMPERATURE,
    };
  }

  // Fall back to process.env for local development
  console.log('Loading environment variables from .env.local');
  config({ path: resolve(process.cwd(), '.env.local') });
  return {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MCP_SERVER_URL: `${process.env.MCP_SERVER_URL ?? 'http://localhost:8787'}/mcp`,
    DEFAULT_MODEL: process.env.DEFAULT_MODEL,
    MAX_TOKENS: process.env.MAX_TOKENS,
    TEMPERATURE: process.env.TEMPERATURE,
  };
}

/**
 * Handles chat endpoint request
 */
export async function handleChatRequest(request: Request): Promise<Response> {
  try {
    // Get environment from Cloudflare context or process.env
    const env = getEnv();

    // Parse and validate request body (AI SDK format)
    const body = await request.json();
    const validation = AISDKRequestSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: `Invalid request: ${validation.error.message}` },
        { status: 400 },
      );
    }

    const { messages } = validation.data;
    console.log('Processing chat request', { messageCount: messages.length });

    // Get tools and create model
    const tools = await getMcpTools(env);
    const model = createModel(env);

    // Convert messages and create workflow
    const langChainMessages = convertToLangChainMessages(messages);
    const app = createWorkflow(model, tools);

    // Execute workflow
    const result = await app.invoke({ messages: langChainMessages });

    console.log('LangGraph result', { result });
    // Extract response
    const finalMessage = result.messages[result.messages.length - 1];
    const reply = extractReply(finalMessage);

    // Return AI SDK compatible response format
    const response = Response.json({
      text: reply,
      role: 'assistant',
    });
    console.log('Response', { response });
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling chat request', { error: errorMessage });
    return Response.json(
      { error: 'An internal error occurred while processing your request' },
      { status: 500 },
    );
  }
}
