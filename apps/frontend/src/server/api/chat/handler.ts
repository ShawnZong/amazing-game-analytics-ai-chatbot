/**
 * Chat API handler logic
 */

import { AIMessage } from '@langchain/core/messages';
import { getMcpTools } from '@/server/lib/chat/mcp-client';
import { convertToLangChainMessages, extractReply } from '@/server/lib/chat/messages';
import { createModel } from '@/server/lib/chat/model';
import { SYSTEM_PROMPT } from '@/server/lib/chat/prompts';
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
  // Store messages outside try block for error handling
  let messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

  try {
    // Get environment from Cloudflare context or process.env
    const env = getEnv();

    // Parse and validate request body
    const body = await request.json();
    const validation = AISDKRequestSchema.safeParse(body);

    if (!validation.success) {
      console.error('Validation failed:', validation.error);
      return Response.json(
        { error: `Invalid request: ${validation.error.message}`, details: validation.error.errors },
        { status: 400 },
      );
    }

    messages = validation.data.messages;

    // Get tools and create model
    const tools = await getMcpTools(env);
    const model = createModel(env);

    // Convert messages and create workflow
    const langChainMessages = convertToLangChainMessages(messages);
    const app = createWorkflow(model, tools);

    // Execute workflow with recursion limit to prevent infinite loops
    // Each round includes: refiner -> llm -> tools -> llm, so we need enough steps
    // MAX_TOOL_ITERATIONS is 30, and each tool round = 2 steps (tools + llm)
    // Plus refiner (1) and condense (1) = ~62 steps minimum, but we'll use 50 for safety
    let result;
    try {
      result = await app.invoke({ messages: langChainMessages }, { recursionLimit: 50 });
    } catch (error) {
      // Handle recursion limit error gracefully - extract partial response
      if (error instanceof Error && error.message.includes('Recursion limit')) {
        console.warn('Recursion limit reached, attempting to extract partial response', {
          error: error.message,
        });
        // Try to get the last state from the error if available
        // If not, we'll handle it in the error catch block below
        throw new Error('RECURSION_LIMIT_REACHED');
      }
      throw error;
    }

    // Extract response
    const finalMessage = result.messages[result.messages.length - 1];
    if (!finalMessage) {
      console.error('No final message in result');
      return Response.json({ error: 'No response generated' }, { status: 500 });
    }

    // Check for token limit error (finish_reason: "length")
    if (AIMessage.isInstance(finalMessage)) {
      const finishReason = finalMessage.response_metadata?.finish_reason;
      if (finishReason === 'length') {
        console.error('Token limit reached', {
          finish_reason: finishReason,
          tokenUsage: finalMessage.response_metadata?.tokenUsage,
        });
        return Response.json(
          {
            error:
              'Token limit reached. The response was cut off because it exceeded the maximum token limit. Please try a simpler or more specific query.',
          },
          { status: 400 },
        );
      }
    }

    const reply = extractReply(finalMessage);
    if (!reply || reply.trim().length === 0) {
      console.error('Empty reply extracted', {
        finish_reason: AIMessage.isInstance(finalMessage)
          ? finalMessage.response_metadata?.finish_reason
          : undefined,
      });
      return Response.json({ error: 'Empty response generated' }, { status: 500 });
    }
    console.log('Reply:', { reply });
    return Response.json(
      { content: reply },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Handle recursion limit error - try to extract partial response
    if (errorMessage === 'RECURSION_LIMIT_REACHED' || errorMessage.includes('Recursion limit')) {
      console.warn(
        'Recursion limit reached, attempting to extract partial response from workflow state',
      );

      try {
        const env = getEnv();
        const model = createModel(env);

        // Try to get the last AI message from the workflow state if available
        // If the error contains state information, we could extract it, but LangGraph doesn't expose this easily
        // Instead, we'll generate a helpful message explaining the situation

        // Get the original user message to understand context
        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1] : null;
        const userQuery = lastUserMessage?.content || 'your query';

        // Generate a final response that acknowledges the limit and provides what we can
        const fallbackPrompt = `The analysis for "${userQuery}" reached the maximum iteration limit. Based on the data collected, provide a comprehensive analysis report with the available information. Clearly state any limitations due to the iteration limit. Structure your response as an Analysis Report with: Data Retrieved, Calculations, Findings, and Implications sections. Be transparent about what data was available and what might be missing.`;

        const fallbackResponse = await model.invoke([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: fallbackPrompt },
        ]);

        const reply = extractReply(fallbackResponse);
        if (reply && reply.trim().length > 0) {
          console.log('Generated fallback response after recursion limit');
          return Response.json(
            { content: reply },
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
              },
            },
          );
        }
      } catch (fallbackError) {
        console.error('Failed to generate fallback response', fallbackError);
      }
    }

    console.error('Error handling chat request', { error: errorMessage });
    return Response.json(
      { error: 'An internal error occurred while processing your request' },
      { status: 500 },
    );
  }
}
