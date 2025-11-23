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
  // Get the MCP server URL, defaulting to localhost if not set
  const serverUrl = env.MCP_SERVER_URL || 'http://localhost:3000';

  // Ensure the URL ends with /mcp endpoint
  const mcpUrl = serverUrl.endsWith('/mcp') ? serverUrl : `${serverUrl}/mcp`;

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
  const client = createMcpClient(env);
  return await client.getTools();
};

// Re-export types for backward compatibility
export type { MultiServerMCPClient };
