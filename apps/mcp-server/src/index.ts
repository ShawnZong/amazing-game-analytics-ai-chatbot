/// <reference types="@cloudflare/workers-types" />

/**
 * MCP Server - Cloudflare Worker
 *
 * Standalone MCP server deployed as a Cloudflare Worker.
 * Provides video game analytics tools via Model Context Protocol.
 *
 * Architecture:
 * - Uses agents/mcp package for MCP server implementation
 * - Exposes MCP protocol over HTTP
 * - Can be called by frontend or external MCP clients
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';
import { TOOLS } from './tool-registry/index';

export interface Env {
  RAWG_API_KEY: string;
  MCP_SERVER_URL?: string;
}

/**
 * RAWG MCP Server Agent
 *
 * Extends McpAgent to provide video game analytics tools
 */
export class RawgMcpAgent extends McpAgent {
  server = new McpServer({
    name: 'RAWG Game Analytics',
    version: '1.0.0',
  });

  private apiKey: string;

  /**
   * Durable Object constructor
   * Called when the Durable Object is instantiated
   */
  constructor(state: DurableObjectState, env: Env) {
    super(state, env);
    // Store API key from env for use in tools
    this.apiKey = env.RAWG_API_KEY;
  }

  async init() {
    // Register all tools from the TOOLS array
    // This approach is more maintainable and uses the descriptions from tool-registry.ts
    for (const tool of TOOLS) {
      this.server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.schema.shape,
        },
        async (args: z.infer<typeof tool.schema>) => {
          try {
            // Args are already validated by MCP server using inputSchema
            // Validate again for type safety and proper TypeScript types
            const validatedArgs = tool.schema.parse(args);
            // Pass API key to tools that need it (tools that don't need it will ignore the second parameter)
            const result = await (tool.execute as any)(validatedArgs, this.apiKey);

            return {
              content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
              structuredContent: result,
              isError: false,
            };
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            return {
              content: [{ type: 'text' as const, text: `Tool execution failed: ${message}` }],
              structuredContent: {},
              isError: true,
            };
          }
        },
      );
    }
  }
}

// This is literally all there is to our Worker
export default RawgMcpAgent.serve('/');
