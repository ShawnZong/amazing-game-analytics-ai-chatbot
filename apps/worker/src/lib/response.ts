/**
 * Response utilities for HTTP handlers
 */

import { ChatResponse, ErrorResponse } from './types';
import { ERROR_CODES, HTTP_STATUS } from './constants';

/**
 * CORS headers for cross-origin requests
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Handle OPTIONS requests for CORS preflight
 */
export function handleOptions(): Response {
  return new Response(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * Create a JSON response with CORS headers
 */
export function jsonResponse(
  data: ChatResponse | ErrorResponse,
  status: number = HTTP_STATUS.OK,
): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Create an error response
 */
export function errorResponse(
  code: string,
  message: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
): Response {
  const error: ErrorResponse = { code, message };
  return jsonResponse(error, status);
}

