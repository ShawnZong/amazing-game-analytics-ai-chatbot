/**
 * LangChain Tools that wrap MCP server functionality
 * 
 * This file wraps all 19 tools from the deployed MCP server on Cloudflare:
 * - 13 Games tools
 * - 2 Genres tools  
 * - 4 Analysis tools
 * 
 * Each tool calls the MCP server via the adapter and returns
 * results in a format consumable by the LLM agent.
 * 
 * Uses shared schemas from @rawg-analytics/shared package to ensure
 * consistency between worker and MCP server.
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
  GenresListArgsSchema,
  GenresReadArgsSchema,
  ExecuteCalculationArgsSchema,
  CompareGroupsArgsSchema,
  TrendAnalysisArgsSchema,
  CorrelationAnalysisArgsSchema,
} from '@rawg-analytics/shared/schemas';
import { invokeMcpTool } from '../services/mcp-adapter';
import { Env } from '../lib/types';

/**
 * Helper function to create a tool wrapper
 */
const createMcpTool = (
  env: Env,
  name: string,
  description: string,
  schema: any
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
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    },
  });
};

// =============================================================================
// GAMES TOOLS (13 tools) - Using shared schemas
// =============================================================================

const createListGamesTool = (env: Env) =>
  createMcpTool(
    env,
    "list_games",
    "Search and filter games from the RAWG database. Supports extensive filtering by platforms, genres, tags, developers, publishers, release dates, Metacritic scores, and more. Use this to discover games based on multiple criteria like 'action games released in 2020 for PlayStation 4' or 'indie games with high ratings'.",
    GamesListArgsSchema
  );

const createGetGameDetailsTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_details",
    "Retrieve comprehensive details about a specific game including description, ratings, release date, platforms, screenshots count, achievements count, and more. Provide either the game ID (integer) or slug (string) to get full game information.",
    GamesReadArgsSchema
  );

const createGetGameAdditionsTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_additions",
    "Get a list of DLCs, GOTY editions, special editions, companion apps, and other additions for a specific game. Useful for finding all related content for a game, such as expansion packs or remastered versions.",
    GamesAdditionsListArgsSchema
  );

const createGetGameDevelopmentTeamTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_development_team",
    "Retrieve a list of individual creators (developers, designers, composers, etc.) who were part of the development team for a specific game. Includes information about their roles and contributions to the game.",
    GamesDevelopmentTeamListArgsSchema
  );

const createGetGameSeriesTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_series",
    "Get all games that are part of the same series as the specified game. For example, if you query 'The Witcher 3', this will return all games in The Witcher series. Useful for discovering related games in a franchise.",
    GamesGameSeriesListArgsSchema
  );

const createGetGameParentGamesTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_parent_games",
    "For DLCs and editions, retrieve the parent/base game. For example, if you query a DLC, this will return the main game it belongs to. Useful for understanding the relationship between base games and their expansions.",
    GamesParentGamesListArgsSchema
  );

const createGetGameScreenshotsTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_screenshots",
    "Retrieve screenshots for a specific game. Returns image URLs, dimensions, and visibility status. Useful for displaying game visuals or building image galleries for game information pages.",
    GamesScreenshotsListArgsSchema
  );

const createGetGameStoresTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_stores",
    "Get links to digital distribution stores (Steam, Epic Games, PlayStation Store, Xbox Store, etc.) where the game can be purchased. Returns store IDs, game IDs, and direct purchase URLs.",
    GamesStoresListArgsSchema
  );

const createGetGameAchievementsTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_achievements",
    "Retrieve a list of achievements for a specific game. Includes achievement names, descriptions, images, and completion percentages. Useful for achievement tracking and game completion analysis.",
    GamesAchievementsReadArgsSchema
  );

const createGetGameMoviesTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_movies",
    "Get a list of game trailers and videos. Returns video names, preview images, and video data. Useful for displaying promotional content or video galleries for games.",
    GamesMoviesReadArgsSchema
  );

const createGetGameRedditTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_reddit",
    "Retrieve the most recent posts from the game's subreddit. Includes post titles, text, images, URLs, usernames, and creation dates. Useful for understanding community discussions and sentiment about a game.",
    GamesRedditReadArgsSchema
  );

const createGetGameSuggestedTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_suggested",
    "Get a list of visually similar games based on the specified game. This feature uses visual similarity algorithms to recommend games. Note: Available only for business and enterprise API users.",
    GamesSuggestedReadArgsSchema
  );

const createGetGameTwitchTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_twitch",
    "Retrieve information about Twitch streams associated with the game. Includes stream details, view counts, thumbnails, and metadata. Useful for tracking game popularity on streaming platforms. Note: Available only for business and enterprise API users.",
    GamesTwitchReadArgsSchema
  );

const createGetGameYoutubeTool = (env: Env) =>
  createMcpTool(
    env,
    "get_game_youtube",
    "Get YouTube videos associated with the game. Includes video details, channel information, view counts, like/dislike counts, and thumbnails. Useful for content discovery and video analytics. Note: Available only for business and enterprise API users.",
    GamesYoutubeReadArgsSchema
  );

// =============================================================================
// GENRES TOOLS (2 tools) - Using shared schemas
// =============================================================================

const createListGenresTool = (env: Env) =>
  createMcpTool(
    env,
    "list_genres",
    "Get a list of all video game genres available in the RAWG database. Returns genre information including name, slug, games count, and images. Genres include Action, Adventure, RPG, Strategy, Puzzle, Shooter, and many more. Use this to discover available genres for filtering games or to build genre browsing interfaces.",
    GenresListArgsSchema
  );

const createGetGenreDetailsTool = (env: Env) =>
  createMcpTool(
    env,
    "get_genre_details",
    "Retrieve detailed information about a specific video game genre. Includes genre name, slug, description, games count, and background image. Use this to get comprehensive information about a particular genre, including statistics about how many games belong to that genre and a detailed description of what defines the genre.",
    GenresReadArgsSchema
  );

// =============================================================================
// ANALYSIS TOOLS (4 tools) - Using shared schemas
// =============================================================================

const createExecuteCalculationTool = (env: Env) =>
  createMcpTool(
    env,
    "execute_calculation",
    "Perform statistical calculations on numeric datasets. Supports operations including mean (average), median, mode, sum, min, max, standard deviation, variance, percentiles, and count. Use this to analyze game scores, ratings, release years, or any numeric game data. For example: calculate average Metacritic score, find median rating, or determine the 90th percentile of game prices.",
    ExecuteCalculationArgsSchema
  );

const createCompareGroupsTool = (env: Env) =>
  createMcpTool(
    env,
    "compare_groups",
    "Compare statistics across multiple groups of data. Computes the same statistical operation (mean, median, sum, min, max, or count) for each group and provides rankings, differences, and percentage comparisons. Perfect for comparing platforms (PlayStation vs Xbox vs PC), genres (Action vs RPG vs Strategy), or time periods. Returns a ranked comparison with the best and worst performers identified.",
    CompareGroupsArgsSchema
  );

const createTrendAnalysisTool = (env: Env) =>
  createMcpTool(
    env,
    "trend_analysis",
    "Analyze time-series data to identify trends and patterns. Supports three types of analysis: (1) Linear Regression - finds the line of best fit and calculates slope to determine if values are rising or falling; (2) Growth Rate - calculates percentage change over time periods; (3) Moving Average - smooths data by averaging values within a sliding window. Use this to track rating trends by year, release patterns over time, or score evolution across game series.",
    TrendAnalysisArgsSchema
  );

const createCorrelationAnalysisTool = (env: Env) =>
  createMcpTool(
    env,
    "correlation_analysis",
    "Calculate the Pearson correlation coefficient between two numeric datasets to measure the strength and direction of their linear relationship. Returns a correlation value from -1 (perfect negative correlation) to +1 (perfect positive correlation), with interpretation of strength (very weak, weak, moderate, strong, very strong) and direction (positive or negative). Use this to find relationships like: Do Metacritic scores correlate with user ratings? Is there a relationship between game length and ratings?",
    CorrelationAnalysisArgsSchema
  );

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

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
    // Games tools (13)
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
    // Genres tools (2)
    createListGenresTool(env),
    createGetGenreDetailsTool(env),
    // Analysis tools (4)
    createExecuteCalculationTool(env),
    createCompareGroupsTool(env),
    createTrendAnalysisTool(env),
    createCorrelationAnalysisTool(env),
  ];
};

