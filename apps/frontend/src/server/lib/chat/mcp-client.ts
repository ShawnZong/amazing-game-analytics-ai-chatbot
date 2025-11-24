/**
 * MCP client initialization and tool fetching
 */

import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import type { StructuredToolInterface } from '@langchain/core/tools';
import type { Env } from '@/server/types/env';

/**
 * Creates MCP client and fetches tools
 */
export async function getMcpTools(env: Env): Promise<StructuredToolInterface[]> {
  if (!env.MCP_SERVER_URL) {
    throw new Error('MCP_SERVER_URL is not set in environment variables');
  }

  const mcpUrl = env.MCP_SERVER_URL;

  try {
    const mcpClient = new MultiServerMCPClient({
      mcpServers: {
        rawg: {
          url: mcpUrl,
        },
      },
      useStandardContentBlocks: true,
    });

    const tools = await mcpClient.getTools();
    console.log(`Loaded ${tools.length} MCP tools from ${mcpUrl}`);

    if (tools.length === 0) {
      throw new Error('No tools found');
    }

    return tools;
  } catch (error) {
    console.error('Failed to initialize MCP client', {
      url: mcpUrl,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
