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
 * Uses the public HTTP URL from MCP_SERVER_URL environment variable.
 * @langchain/mcp-adapters handles HTTP/SSE automatically - no fetch override needed.
 *
 * @param env - Cloudflare Worker environment
 * @returns MultiServerMCPClient instance configured for the RAWG MCP server
 */
export const createMcpClient = (env: Env): MultiServerMCPClient => {
  // Use the public HTTP URL - @langchain/mcp-adapters handles HTTP/SSE automatically

  return new MultiServerMCPClient({
    mcpServers: {
      rawg: {
        url: env.MCP_SERVER_URL ?? 'http://localhost:3000',
      },
    },
    useStandardContentBlocks: true,
  });
};

/**
 * Gets all tools from the MCP server using the official adapter
 *
 * @langchain/mcp-adapters handles HTTP/SSE requests automatically.
 * No fetch override needed - standard HTTP requests work out of the box.
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
