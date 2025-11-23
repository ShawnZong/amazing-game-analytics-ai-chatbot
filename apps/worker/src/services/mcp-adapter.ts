/**
 * MCP (Model Context Protocol) Adapter using LangChain.js MCP Adapters
 *
 * This module uses the official @langchain/mcp-adapters package to connect
 * to the MCP server and provide tools for the LLM agent.
 *
 * Reference: https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-mcp-adapters
 */

import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import type { Env } from '../lib/types';

/**
 * Creates an MCP client instance using the official LangChain adapter
 *
 * @param env - Cloudflare Worker environment
 * @returns MultiServerMCPClient instance configured for the RAWG MCP server
 */
export const createMcpClient = (env: Env): MultiServerMCPClient => {
  let mcpUrl: string;

  // Prefer service binding over HTTP URL for internal communication
  if (env.MCP_SERVER) {
    // Use service binding with internal URL format
    // Service bindings route internally when using the service name as hostname
    mcpUrl = 'https://rawg-mcp-agent/mcp';
  } else {
    // Fallback to HTTP URL (for local development)
    const serverUrl = env.MCP_SERVER_URL || 'http://localhost:3000';
    mcpUrl = serverUrl.endsWith('/mcp') ? serverUrl : `${serverUrl}/mcp`;
  }

  return new MultiServerMCPClient({
    rawg: {
      transport: 'http', // Streamable HTTP transport (replaces deprecated 'sse')
      url: mcpUrl,
    },
  });
};

/**
 * Gets all tools from the MCP server using the official adapter
 *
 * @param env - Cloudflare Worker environment
 * @returns Promise resolving to an array of LangChain tools
 */
export const getMcpTools = async (env: Env) => {
  // If service binding is available, we need to use it for fetch calls
  // The MultiServerMCPClient uses global fetch, so we temporarily override it
  // when service binding is present
  if (env.MCP_SERVER) {
    const originalFetch = globalThis.fetch;
    
    // Override fetch to use service binding for MCP server URLs
    globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' 
        ? input 
        : input instanceof URL 
          ? input.toString() 
          : input instanceof Request
            ? input.url
            : String(input);
      
      // If this is a request to our MCP server, use the service binding
      if (url.startsWith('https://rawg-mcp-agent/')) {
        // Extract path and use service binding
        const path = url.replace('https://rawg-mcp-agent', '');
        const request = input instanceof Request 
          ? new Request(`https://rawg-mcp-agent${path}`, input)
          : new Request(`https://rawg-mcp-agent${path}`, init);
        return env.MCP_SERVER!.fetch(request);
      }
      
      // Otherwise use original fetch
      return originalFetch(input, init);
    };
    
    try {
      const client = createMcpClient(env);
      const tools = await client.getTools();
      return tools;
    } finally {
      // Restore original fetch to prevent side effects
      globalThis.fetch = originalFetch;
    }
  } else {
    // No service binding, use HTTP URL (normal flow)
    const client = createMcpClient(env);
    return await client.getTools();
  }
};

// Re-export types for backward compatibility
export type { MultiServerMCPClient };
