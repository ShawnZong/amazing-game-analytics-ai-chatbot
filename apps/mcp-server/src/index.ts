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

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
interface Env {
  RAWG_API_KEY: string;
  MCP_SERVER_URL?: string;
}


/**
 * RAWG MCP Agent
 *
 * Extends McpAgent to provide video game analytics tools
 */
export class RawgMcpAgent extends McpAgent {
  server = new McpServer({
    name: "RAWG Game Analytics",
    version: "1.0.0",
  });

  async init() {}
}

/**
 * Main fetch handler for Cloudflare Worker
 */
const worker: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Root path - server info
    if (url.pathname === "/" && request.method === "GET") {
      return new Response(
        JSON.stringify(
          {
            name: "RAWG Game Analytics",
            version: "1.0.0",
            protocolVersion: "2024-11-05",
          },
          null,
          2
        ),
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }


    if (url.pathname === "/" || url.pathname === "/mcp") {
      return RawgMcpAgent.serve("/mcp").fetch(request, env, ctx);
    }

    // 404 for other routes
    return new Response("Not Found", { status: 404 });
  },
};

export default worker;
