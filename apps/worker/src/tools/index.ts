/**
 * LangChain Tools Module
 * 
 * This module provides all tools that wrap MCP server functionality.
 * Tools are organized by category:
 * - Games tools (13 tools)
 * - Genres tools (2 tools)
 * - Analysis tools (4 tools)
 * 
 * Each tool calls the MCP server via the adapter and returns
 * results in a format consumable by the LLM agent.
 * 
 * Uses shared schemas from @rawg-analytics/shared package to ensure
 * consistency between worker and MCP server.
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { createGamesTools } from './games-tools';
import { createGenresTools } from './genres-tools';
import { createAnalysisTools } from './analysis-tools';
import type { Env } from '../lib/types';

/**
 * Factory function to create all available tools
 * 
 * Creates all 19 tools from the MCP server:
 * - 13 Games tools
 * - 2 Genres tools
 * - 4 Analysis tools
 * 
 * @param env - Cloudflare Worker environment
 * @returns Array of LangChain tools
 */
export const createAllTools = (env: Env): DynamicStructuredTool[] => {
  return [
    ...createGamesTools(env),
    ...createGenresTools(env),
    ...createAnalysisTools(env),
  ];
};

// Re-export individual tool creators for flexibility
export * from './games-tools';
export * from './genres-tools';
export * from './analysis-tools';
export * from './utils/tool-factory';

