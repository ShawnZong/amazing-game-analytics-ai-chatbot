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

// Request-scoped API key storage (Cloudflare Workers run one request at a time per isolate)
let currentApiKey: string | undefined;

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

  async init(apiKey?: string) {
    // Store API key for this request (use provided key or fall back to module-level variable)
    if (apiKey !== undefined) {
      currentApiKey = apiKey;
    }
    
    // Register all tools from the TOOLS array
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
            const result = await (tool.execute as any)(validatedArgs, currentApiKey);

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
        }
      );
    }
  }
}

/**
 * Main fetch handler for Cloudflare Worker
 */
const worker: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Root path - server info
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(
        JSON.stringify(
          {
            name: 'RAWG Game Analytics',
            version: '1.0.0',
            protocolVersion: '2024-11-05',
          },
          null,
          2
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // MCP endpoint - use serve method but ensure API key is available
    if (url.pathname === '/' || url.pathname === '/mcp') {
      // Set API key for this request (Cloudflare Workers run one request per isolate)
      currentApiKey = env.RAWG_API_KEY;
      
      // Use the parent class's serve method which handles MCP protocol
      // The tools will access currentApiKey from the closure
      return RawgMcpAgent.serve('/mcp').fetch(request, env, ctx);
    }

    // 404 for other routes
    return new Response('Not Found', { status: 404 });
  },
};

export default worker;

