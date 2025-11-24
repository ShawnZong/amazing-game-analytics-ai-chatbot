/**
 * Chat API handler logic
 */

import { getMcpTools } from '@/server/lib/chat/mcp-client';
import { convertToLangChainMessages, extractReply } from '@/server/lib/chat/messages';
import { createModel } from '@/server/lib/chat/model';
import { createWorkflow } from '@/server/lib/chat/workflow';
import { getEnv } from '@/server/lib/env';
import { z } from 'zod';

// Message schema - only accepts content string format
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
