/**
 * Root endpoint handler (health check / info)
 */

import { Env } from '../lib/types';
import { getModelInfo } from '../llm/model-factory';
import { jsonResponse } from '../lib/response';

/**
 * Handle GET / endpoint (health check / info)
 */
export function handleRoot(env: Env): Response {
  const info = {
    service: 'RAWG Analytics LLM Worker',
    version: '1.0.0',
    endpoints: {
      chat: 'POST /chat',
    },
    model: getModelInfo(env),
    status: 'operational',
  };

  return jsonResponse(info as any);
}

