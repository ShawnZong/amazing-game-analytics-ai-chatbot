/**
 * Chat API handler logic
 */

import { z } from 'zod';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { Env } from '@/server/types/env';
import { getMcpTools } from '@/server/lib/chat/mcp-client';
import { createModel } from '@/server/lib/chat/model';
import { convertToLangChainMessages, extractReply } from '@/server/lib/chat/messages';
import { createWorkflow } from '@/server/lib/chat/workflow';

// AI SDK message format schema
const AISDKMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const AISDKRequestSchema = z.object({
  messages: z.array(AISDKMessageSchema),
});

/**
 * Handles chat endpoint request
 */
export async function handleChatRequest(request: Request): Promise<Response> {
  try {
    // Get environment from Cloudflare context
    const context = getCloudflareContext();
    if (!context?.env) {
      return Response.json({ error: 'Cloudflare environment not available' }, { status: 500 });
    }

    const env = context.env as CloudflareEnv & Env;

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

    // Extract response
    const finalMessage = result.messages[result.messages.length - 1];
    const reply = extractReply(finalMessage);

    // Return AI SDK compatible response format
    return Response.json({
      text: reply,
      role: 'assistant',
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

