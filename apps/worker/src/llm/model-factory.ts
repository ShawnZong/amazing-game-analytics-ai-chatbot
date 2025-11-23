/**
 * Chat Model Factory
 * 
 * This module provides a factory function that creates the appropriate
 * chat model based on environment configuration.
 * 
 * When OPENAI_API_KEY is provided: Uses ChatOpenAI (GPT-4)
 * When OPENAI_API_KEY is missing: Uses MockChatModel
 * 
 * This design allows seamless switching between mock and production models
 * without any code changes - just set the environment variable.
 */

import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';
import { MockChatModel } from './mock-chat-model';
import { Env } from '../lib/types';
import { MODEL_CONFIG } from '../lib/constants';

/**
 * Create a chat model instance based on environment configuration
 * 
 * @param env - Cloudflare Worker environment bindings
 * @returns A BaseChatModel instance (either ChatOpenAI or MockChatModel)
 * 
 * Usage example:
 * ```typescript
 * const model = createChatModel(env);
 * const response = await model.invoke([
 *   new HumanMessage("What are the top games?")
 * ]);
 * ```
 */
export function createChatModel(env: Env): BaseChatModel {
  // Check if OpenAI API key is configured
  if (env.OPENAI_API_KEY) {
    // Log model selection (without exposing API key)

    /**
     * ChatOpenAI configuration for GPT-4
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
  } else {
    // Using MockChatModel (OPENAI_API_KEY not configured)

    /**
     * Return the mock model for development/testing
     * 
     * The mock model returns deterministic responses without
     * requiring API access. Perfect for:
     * - Local development
     * - Testing the integration flow
     * - Demos without API costs
     * 
     * To switch to real GPT-4:
     * 1. Set OPENAI_API_KEY environment variable via:
     *    - wrangler secret put OPENAI_API_KEY (for deployed workers)
     *    - .dev.vars file (for local development)
     * 2. No code changes required - the factory handles the switch
     */
    return new MockChatModel();
  }
}

/**
 * Get model information for debugging/logging
 * 
 * @param env - Cloudflare Worker environment
 * @returns Object with model type and configuration
 */
export function getModelInfo(env: Env): {
  type: "openai" | "mock";
  model?: string;
  config: Record<string, any>;
} {
  if (env.OPENAI_API_KEY) {
    return {
      type: "openai",
      model: env.DEFAULT_MODEL || MODEL_CONFIG.GPT4_MODEL,
      config: {
        temperature: env.TEMPERATURE || MODEL_CONFIG.TEMPERATURE,
        maxTokens: env.MAX_TOKENS || MODEL_CONFIG.MAX_TOKENS,
      },
    };
  } else {
    return {
      type: "mock",
      config: {},
    };
  }
}

