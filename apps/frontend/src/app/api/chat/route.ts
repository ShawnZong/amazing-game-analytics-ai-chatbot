/**
 * POST /api/chat
 *
 * Next.js API route - thin wrapper that delegates to server handler
 */

import { handleChatRequest } from '@/server/api/chat/handler';

export async function POST(request: Request): Promise<Response> {
  return handleChatRequest(request);
}
