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

// AI SDK message part type
type MessagePart = {
  type: string;
  text?: string;
  [key: string]: unknown;
};

// AI SDK message format schema - supports both content string and parts array
// AI SDK v5 sends messages with parts array, but we also support content string for compatibility
const AISDKMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().optional(),
    parts: z.array(z.record(z.unknown())).optional(),
  })
  .refine(
    data =>
      data.content !== undefined ||
      (data.parts !== undefined && Array.isArray(data.parts) && data.parts.length > 0),
    { message: "Message must have either 'content' or 'parts' array" },
  );

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
    console.log('Received request body:', JSON.stringify(body, null, 2));

    const validation = AISDKRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      console.error('Request body was:', JSON.stringify(body, null, 2));
      return Response.json(
        { error: `Invalid request: ${validation.error.message}`, details: validation.error.errors },
        { status: 400 },
      );
    }

    const { messages } = validation.data;
    console.log('Processing chat request', { messageCount: messages.length });

    // Convert AI SDK messages (with parts) to simple format with content string
    const convertedMessages = messages.map(msg => {
      // If message has content string, use it directly
      if (msg.content && typeof msg.content === 'string') {
        return { role: msg.role, content: msg.content };
      }
      // If message has parts array, extract text from text parts
      if (msg.parts && Array.isArray(msg.parts)) {
        const textContent =
          msg.parts
            .filter(
              (part): part is MessagePart =>
                typeof part === 'object' &&
                part !== null &&
                'type' in part &&
                part.type === 'text' &&
                typeof part.text === 'string',
            )
            .map(part => part.text as string)
            .join('') || '';
        return { role: msg.role, content: textContent };
      }
      // Fallback - should not happen due to schema validation
      console.warn('Message has neither content nor parts:', msg);
      return { role: msg.role, content: '' };
    });

    // Get tools and create model
    const tools = await getMcpTools(env);
    const model = createModel(env);

    // Convert messages and create workflow
    const langChainMessages = convertToLangChainMessages(convertedMessages);
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

    // Return JSON response with content field
    // Format: { content: string }
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
