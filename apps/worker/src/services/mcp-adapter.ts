/**
 * MCP (Model Context Protocol) Adapter
 * 
 * This module provides a client to connect to the MCP server using JSON-RPC.
 * The MCP server exposes tools that can be invoked by the LLM agent.
 */

import { Env } from '../lib/types';

/**
 * JSON-RPC request structure
 */
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, any>;
}

/**
 * JSON-RPC response structure
 */
interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

/**
 * MCP Tool definition received from the server
 */
export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

/**
 * MCP Client class for communicating with the MCP server
 */
export class McpClient {
  private serverUrl: string;
  private requestId = 0;

  constructor(env: Env) {
    this.serverUrl = env.MCP_SERVER_URL;
  }

  /**
   * Generate a unique request ID
   */
  private getNextRequestId(): number {
    return ++this.requestId;
  }

  /**
   * Send a JSON-RPC request to the MCP server
   */
  private async sendRequest(
    method: string,
    params?: Record<string, any>
  ): Promise<any> {
    const request: JsonRpcRequest = {
      jsonrpc: "2.0",
      id: this.getNextRequestId(),
      method,
      params,
    };

    try {
      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(
          `MCP server returned ${response.status}: ${response.statusText}`
        );
      }

      const jsonResponse: JsonRpcResponse = await response.json();

      if (jsonResponse.error) {
        throw new Error(
          `MCP error ${jsonResponse.error.code}: ${jsonResponse.error.message}`
        );
      }

      return jsonResponse.result;
    } catch (error) {
      console.error("MCP request failed:", error);
      throw new Error(
        `Failed to communicate with MCP server: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * List all available tools from the MCP server
   */
  async listTools(): Promise<McpTool[]> {
    try {
      const result = await this.sendRequest("tools/list");
      return result.tools || [];
    } catch (error) {
      console.error("Failed to list MCP tools:", error);
      return [];
    }
  }

  /**
   * Invoke a specific tool on the MCP server
   * 
   * @param name - Tool name
   * @param args - Tool arguments
   * @returns Tool execution result
   */
  async invokeTool(
    name: string,
    args: Record<string, any>
  ): Promise<any> {
    return await this.sendRequest("tools/call", {
      name,
      arguments: args,
    });
  }
}

/**
 * Factory function to create an MCP client instance
 */
export function createMcpClient(env: Env): McpClient {
  return new McpClient(env);
}

/**
 * Helper function to invoke an MCP tool
 * This is the main function that LangChain tools will use
 * 
 * @param env - Cloudflare Worker environment
 * @param name - Tool name
 * @param args - Tool arguments
 * @returns Tool execution result
 */
export async function invokeMcpTool(
  env: Env,
  name: string,
  args: Record<string, any>
): Promise<any> {
  const client = createMcpClient(env);
  return await client.invokeTool(name, args);
}

