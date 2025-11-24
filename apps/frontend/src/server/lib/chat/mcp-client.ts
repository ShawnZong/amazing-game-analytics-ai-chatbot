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
  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      rawg: {
        url: `${env.MCP_SERVER_URL ?? 'http://localhost:8787'}/mcp`,
      },
    },
    useStandardContentBlocks: true,
  });

  const tools = await mcpClient.getTools();
  console.log(`Loaded ${tools.length} MCP tools`);

  if (tools.length === 0) {
    throw new Error('No tools found');
  }

  return tools;
}
