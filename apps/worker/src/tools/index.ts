/**
 * LangChain Tools Module
 *
 * This module provides all tools from the MCP server using the official
 * LangChain.js MCP adapter.
 *
 * The tools are automatically loaded from the MCP server and converted
 * to LangChain-compatible tools by the adapter.
 *
 * Reference: https://github.com/langchain-ai/langchainjs/tree/main/libs/langchain-mcp-adapters
 */

import type { DynamicStructuredTool } from '@langchain/core/tools';
import { getMcpTools } from '../services/mcp-adapter';
import type { Env } from '../lib/types';

/**
 * Factory function to create all available tools from the MCP server
 *
 * Uses the official LangChain MCP adapter to automatically load and convert
 * all tools from the MCP server into LangChain-compatible tools.
 *
 * @param env - Cloudflare Worker environment
 * @returns Promise resolving to an array of LangChain tools
 */
export const createAllTools = async (env: Env): Promise<DynamicStructuredTool[]> => {
  return await getMcpTools(env);
};
