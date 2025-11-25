/**
 * OpenAI model creation and configuration
 */

import { ChatOpenAI } from '@langchain/openai';
import type { Env } from '@/server/types/env';

/**
 * Creates ChatOpenAI model with configuration from environment
 */
export function createModel(env: Env): ChatOpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }

  return new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: env.DEFAULT_MODEL ?? 'gpt-5-mini',
    temperature: parseFloat(env.TEMPERATURE ?? '0.7'),
    maxTokens: parseInt(env.MAX_TOKENS ?? '2000', 10),
  });
}
