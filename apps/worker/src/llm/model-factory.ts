/**
 * Chat Model Factory
 *
 * This module provides a factory function that creates ChatOpenAI instances
 * based on environment configuration.
 */

import { ChatOpenAI } from '@langchain/openai';
import { MODEL_CONFIG } from '../lib/constants';
import { Env } from '../lib/types';

/**
 * Create a chat model instance based on environment configuration
 *
 * @param env - Cloudflare Worker environment bindings
 * @returns A ChatOpenAI instance
 *
 * Usage example:
 * ```typescript
 * const model = createChatModel(env);
 * const response = await model.invoke([
 *   new HumanMessage("What are the top games?")
 * ]);
 * ```
 */
export function createChatModel(env: Env): ChatOpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required. Please set it in your environment variables.');
  }

  /**
   * ChatOpenAI configuration
   *
   * Model options:
   * - "gpt-4o": Latest GPT-4 optimized model (recommended)
   * - "gpt-4": Original GPT-4 model
   * - "gpt-4-turbo": Faster, cheaper GPT-4 variant
   *
   * TODO: Streaming support
   * To enable streaming in the future:
   * 1. Set streaming: true in the configuration below
   * 2. Use model.stream() instead of model.invoke()
   * 3. Update the Worker to send Server-Sent Events (SSE)
   * 4. Update the frontend to handle SSE responses
   *
   * Example streaming setup:
   * ```typescript
   * const stream = await model.stream(messages);
   * for await (const chunk of stream) {
   *   // Send chunk to client via SSE
   * }
   * ```
   */
  return new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: env.DEFAULT_MODEL || MODEL_CONFIG.GPT4_MODEL,
    temperature: parseFloat(env.TEMPERATURE || String(MODEL_CONFIG.TEMPERATURE)),
    maxTokens: parseInt(env.MAX_TOKENS || String(MODEL_CONFIG.MAX_TOKENS), 10),
    // streaming: false, // Set to true when implementing streaming
    // callbacks: [], // Add callbacks for streaming chunks
  });
}

/**
 * Get model information for debugging/logging
 *
 * @param env - Cloudflare Worker environment
 * @returns Object with model type and configuration
 */
export function getModelInfo(env: Env): {
  type: 'openai';
  model?: string;
  config: Record<string, any>;
} {
  return {
    type: 'openai',
    model: env.DEFAULT_MODEL || MODEL_CONFIG.GPT4_MODEL,
    config: {
      temperature: env.TEMPERATURE || MODEL_CONFIG.TEMPERATURE,
      maxTokens: env.MAX_TOKENS || MODEL_CONFIG.MAX_TOKENS,
    },
  };
}
