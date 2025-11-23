/**
 * Shared utility for creating MCP tool wrappers
 * 
 * This module provides a factory function to create LangChain tools
 * that wrap MCP server functionality.
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { invokeMcpTool } from '../../services/mcp-adapter';
import type { Env } from '../../lib/types';
import type { ZodSchema } from 'zod';

/**
 * Creates a LangChain tool that wraps an MCP server tool
 * 
 * @param env - Cloudflare Worker environment
 * @param name - Tool name (must match MCP server tool name)
 * @param description - Tool description for the LLM
 * @param schema - Zod schema for tool arguments
 * @returns A DynamicStructuredTool instance
 */
export const createMcpTool = (
  env: Env,
  name: string,
  description: string,
  schema: ZodSchema
): DynamicStructuredTool => {
  return new DynamicStructuredTool({
    name,
    description,
    schema,
    func: async (args) => {
      try {
        const result = await invokeMcpTool(env, name, args);
        return JSON.stringify(result, null, 2);
      } catch (error) {
        return JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    },
  });
};

