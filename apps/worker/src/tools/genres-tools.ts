/**
 * Genres-related LangChain tools
 * 
 * This module provides 2 tools for interacting with game genre data:
 * - List all genres
 * - Get detailed genre information
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import {
  GenresListArgsSchema,
  GenresReadArgsSchema,
} from '@rawg-analytics/shared/schemas';
import { createMcpTool } from './utils/tool-factory';
import type { Env } from '../lib/types';

/**
 * Creates a tool to list all game genres
 */
export const createListGenresTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'list_genres',
    'Get a list of all video game genres available in the RAWG database. Returns genre information including name, slug, games count, and images. Genres include Action, Adventure, RPG, Strategy, Puzzle, Shooter, and many more. Use this to discover available genres for filtering games or to build genre browsing interfaces.',
    GenresListArgsSchema
  );

/**
 * Creates a tool to get detailed genre information
 */
export const createGetGenreDetailsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_genre_details',
    'Retrieve detailed information about a specific video game genre. Includes genre name, slug, description, games count, and background image. Use this to get comprehensive information about a particular genre, including statistics about how many games belong to that genre and a detailed description of what defines the genre.',
    GenresReadArgsSchema
  );

/**
 * Creates all genres-related tools
 * 
 * @param env - Cloudflare Worker environment
 * @returns Array of 2 genres tools
 */
export const createGenresTools = (env: Env): DynamicStructuredTool[] => [
  createListGenresTool(env),
  createGetGenreDetailsTool(env),
];

