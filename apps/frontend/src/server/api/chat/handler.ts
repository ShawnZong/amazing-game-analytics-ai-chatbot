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

    console.log('LangGraph result', {
      messageCount: result.messages.length,
      lastMessageType: result.messages[result.messages.length - 1]?.constructor?.name,
      lastMessageContent: result.messages[result.messages.length - 1]?.content,
    });

    // Extract response
    const finalMessage = result.messages[result.messages.length - 1];
    if (!finalMessage) {
      console.error('No final message in result', { result });
      return Response.json({ error: 'No response generated' }, { status: 500 });
    }

    const reply = extractReply(finalMessage);
    console.log('Extracted reply', { reply, replyLength: reply.length });

    if (!reply || reply.trim().length === 0) {
      console.error('Empty reply extracted', { finalMessage });
      return Response.json({ error: 'Empty response generated' }, { status: 500 });
    }

    // AI SDK useChat expects JSON response with content field for non-streaming
    // The format should match: { content: string } or just return the text
    // Based on AI SDK docs, non-streaming responses can be simple text or JSON
    const responseBody = { content: reply };
    console.log('Response body', {
      content: reply.substring(0, 100) + (reply.length > 100 ? '...' : ''),
      contentLength: reply.length,
    });

    return Response.json(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling chat request', { error: errorMessage });
    return Response.json(
      { error: 'An internal error occurred while processing your request' },
      { status: 500 },
    );
  }
}
