import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { ChatRequest, ChatResponse, ErrorResponse } from '@/types/chat';

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || 'http://localhost:8787';

/**
 * POST /api/chat
 *
 * Server-side API route that handles chat messages to the backend worker.
 * Uses Cloudflare service bindings in production, falls back to HTTP in development.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const body: ChatRequest = await request.json();
    const { sessionId, messages } = body;

    // Try to use service binding first (production)
    // Fetcher is a global type in Cloudflare Workers runtime
    let backend: Fetcher | undefined;
    let useServiceBinding = false;

    try {
      const context = getCloudflareContext();
      console.log('Cloudflare context:', {
        hasContext: !!context,
        hasEnv: !!context?.env,
        envKeys: context?.env ? Object.keys(context.env) : [],
      });

      if (context?.env) {
        // Use generated CloudflareEnv type for type safety
        // CloudflareEnv is declared in cloudflare-env.d.ts
        const env = context.env as CloudflareEnv;
        backend = env.BACKEND;
        useServiceBinding = !!backend;
        console.log('Service binding check:', {
          hasBackend: !!backend,
          backendType: typeof backend,
          useServiceBinding,
        });
      } else {
        console.warn('Cloudflare context exists but env is not available');
      }
    } catch (error) {
      // getCloudflareContext() not available (e.g., during build or not initialized)
      // Will fallback to HTTP fetch
      console.warn('Service binding not available, using HTTP fallback:', error);
    }

    let response: Response;

    if (useServiceBinding && backend) {
      try {
        // Use service binding for internal communication
        // Service bindings route internally - we can use any URL format
        // Using the service name as hostname (matches mcp-adapter pattern)
        // Note: Service bindings route based on the binding, not the URL hostname
        const serviceUrl = new URL('/chat', 'https://rawg-analytics-worker');
        const serviceRequest = new Request(serviceUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, messages }),
        });
        console.log('Using service binding to call backend');
        response = await backend.fetch(serviceRequest);
        console.log('Service binding response status:', response.status);
      } catch (bindingError) {
        // If service binding fails, fallback to HTTP
        console.error('Service binding fetch failed, falling back to HTTP:', { bindingError });
        response = await fetch(`${WORKER_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId, messages }),
        });
      }
    } else {
      // Fallback to HTTP fetch (local development or when binding unavailable)
      console.log('Falling back to HTTP fetch');
      response = await fetch(`${WORKER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, messages }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      const error = data as ErrorResponse;
      return Response.json(
        { code: error.code, message: error.message },
        { status: response.status },
      );
    }

    return Response.json(data as ChatResponse);
  } catch (error) {
    // Log the full error for debugging
    console.error('Chat API route error:', error);
    return Response.json(
      {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Failed to send chat message',
      },
      { status: 500 },
    );
  }
}
