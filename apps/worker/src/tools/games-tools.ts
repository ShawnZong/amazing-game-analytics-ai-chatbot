/**
 * Games-related LangChain tools
 * 
 * This module provides 13 tools for interacting with game data from the RAWG API:
 * - List and search games
 * - Get game details, additions, development team
 * - Get game series, parent games, screenshots, stores
 * - Get achievements, movies, Reddit posts, suggestions
 * - Get Twitch and YouTube content
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import {
  GamesListArgsSchema,
  GamesReadArgsSchema,
  GamesAdditionsListArgsSchema,
  GamesDevelopmentTeamListArgsSchema,
  GamesGameSeriesListArgsSchema,
  GamesParentGamesListArgsSchema,
  GamesScreenshotsListArgsSchema,
  GamesStoresListArgsSchema,
  GamesAchievementsReadArgsSchema,
  GamesMoviesReadArgsSchema,
  GamesRedditReadArgsSchema,
  GamesSuggestedReadArgsSchema,
  GamesTwitchReadArgsSchema,
  GamesYoutubeReadArgsSchema,
} from '@rawg-analytics/shared/schemas';
import { createMcpTool } from './utils/tool-factory';
import type { Env } from '../lib/types';

/**
 * Creates a tool to search and filter games
 */
export const createListGamesTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'list_games',
    "Search and filter games from the RAWG database. Supports extensive filtering by platforms, genres, tags, developers, publishers, release dates, Metacritic scores, and more. Use this to discover games based on multiple criteria like 'action games released in 2020 for PlayStation 4' or 'indie games with high ratings'.",
    GamesListArgsSchema
  );

/**
 * Creates a tool to get comprehensive game details
 */
export const createGetGameDetailsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_details',
    'Retrieve comprehensive details about a specific game including description, ratings, release date, platforms, screenshots count, achievements count, and more. Provide either the game ID (integer) or slug (string) to get full game information.',
    GamesReadArgsSchema
  );

/**
 * Creates a tool to get game additions (DLCs, editions, etc.)
 */
export const createGetGameAdditionsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_additions',
    'Get a list of DLCs, GOTY editions, special editions, companion apps, and other additions for a specific game. Useful for finding all related content for a game, such as expansion packs or remastered versions.',
    GamesAdditionsListArgsSchema
  );

/**
 * Creates a tool to get game development team information
 */
export const createGetGameDevelopmentTeamTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_development_team',
    'Retrieve a list of individual creators (developers, designers, composers, etc.) who were part of the development team for a specific game. Includes information about their roles and contributions to the game.',
    GamesDevelopmentTeamListArgsSchema
  );

/**
 * Creates a tool to get games in the same series
 */
export const createGetGameSeriesTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_series',
    "Get all games that are part of the same series as the specified game. For example, if you query 'The Witcher 3', this will return all games in The Witcher series. Useful for discovering related games in a franchise.",
    GamesGameSeriesListArgsSchema
  );

/**
 * Creates a tool to get parent/base game for DLCs
 */
export const createGetGameParentGamesTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_parent_games',
    'For DLCs and editions, retrieve the parent/base game. For example, if you query a DLC, this will return the main game it belongs to. Useful for understanding the relationship between base games and their expansions.',
    GamesParentGamesListArgsSchema
  );

/**
 * Creates a tool to get game screenshots
 */
export const createGetGameScreenshotsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_screenshots',
    'Retrieve screenshots for a specific game. Returns image URLs, dimensions, and visibility status. Useful for displaying game visuals or building image galleries for game information pages.',
    GamesScreenshotsListArgsSchema
  );

/**
 * Creates a tool to get game store links
 */
export const createGetGameStoresTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_stores',
    'Get links to digital distribution stores (Steam, Epic Games, PlayStation Store, Xbox Store, etc.) where the game can be purchased. Returns store IDs, game IDs, and direct purchase URLs.',
    GamesStoresListArgsSchema
  );

/**
 * Creates a tool to get game achievements
 */
export const createGetGameAchievementsTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_achievements',
    'Retrieve a list of achievements for a specific game. Includes achievement names, descriptions, images, and completion percentages. Useful for achievement tracking and game completion analysis.',
    GamesAchievementsReadArgsSchema
  );

/**
 * Creates a tool to get game trailers and videos
 */
export const createGetGameMoviesTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_movies',
    'Get a list of game trailers and videos. Returns video names, preview images, and video data. Useful for displaying promotional content or video galleries for games.',
    GamesMoviesReadArgsSchema
  );

/**
 * Creates a tool to get Reddit posts about a game
 */
export const createGetGameRedditTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_reddit',
    "Retrieve the most recent posts from the game's subreddit. Includes post titles, text, images, URLs, usernames, and creation dates. Useful for understanding community discussions and sentiment about a game.",
    GamesRedditReadArgsSchema
  );

/**
 * Creates a tool to get visually similar games
 */
export const createGetGameSuggestedTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_suggested',
    'Get a list of visually similar games based on the specified game. This feature uses visual similarity algorithms to recommend games. Note: Available only for business and enterprise API users.',
    GamesSuggestedReadArgsSchema
  );

/**
 * Creates a tool to get Twitch stream information
 */
export const createGetGameTwitchTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_twitch',
    'Retrieve information about Twitch streams associated with the game. Includes stream details, view counts, thumbnails, and metadata. Useful for tracking game popularity on streaming platforms. Note: Available only for business and enterprise API users.',
    GamesTwitchReadArgsSchema
  );

/**
 * Creates a tool to get YouTube videos for a game
 */
export const createGetGameYoutubeTool = (env: Env): DynamicStructuredTool =>
  createMcpTool(
    env,
    'get_game_youtube',
    'Get YouTube videos associated with the game. Includes video details, channel information, view counts, like/dislike counts, and thumbnails. Useful for content discovery and video analytics. Note: Available only for business and enterprise API users.',
    GamesYoutubeReadArgsSchema
  );

/**
 * Creates all games-related tools
 * 
 * @param env - Cloudflare Worker environment
 * @returns Array of 13 games tools
 */
export const createGamesTools = (env: Env): DynamicStructuredTool[] => [
  createListGamesTool(env),
  createGetGameDetailsTool(env),
  createGetGameAdditionsTool(env),
  createGetGameDevelopmentTeamTool(env),
  createGetGameSeriesTool(env),
  createGetGameParentGamesTool(env),
  createGetGameScreenshotsTool(env),
  createGetGameStoresTool(env),
  createGetGameAchievementsTool(env),
  createGetGameMoviesTool(env),
  createGetGameRedditTool(env),
  createGetGameSuggestedTool(env),
  createGetGameTwitchTool(env),
  createGetGameYoutubeTool(env),
];

