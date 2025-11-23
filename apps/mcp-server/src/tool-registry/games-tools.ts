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
} from '../schemas/args';
import {
  listGames,
  getGameDetails,
  getGameAdditions,
  getGameDevelopmentTeam,
  getGameSeries,
  getGameParentGames,
  getGameScreenshots,
  getGameStores,
  getGameAchievements,
  getGameMovies,
  getGameReddit,
  getGameSuggested,
  getGameTwitch,
  getGameYoutube,
} from '../tools/rawg';

/**
 * Games API Tools
 *
 * Array of MCP tools for the games endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const GAMES_TOOLS = [
  {
    name: 'list_games',
    title: 'List Games',
    description:
      'Search and filter games from the RAWG database. Supports extensive filtering by platforms, genres, tags, developers, publishers, release dates, Metacritic scores, and more. Use this to discover games based on multiple criteria like "action games released in 2020 for PlayStation 4" or "indie games with high ratings". Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "rating", "platforms.name"]).',
    schema: GamesListArgsSchema,
    execute: listGames,
  },
  {
    name: 'get_game_details',
    title: 'Get Game Details',
    description:
      'Retrieve comprehensive details about a specific game including description, ratings, release date, platforms, screenshots count, achievements count, and more. Provide either the game ID (integer) or slug (string) to get full game information. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "rating", "platforms.name"]).',
    schema: GamesReadArgsSchema,
    execute: getGameDetails,
  },
  {
    name: 'get_game_additions',
    title: 'Get Game Additions',
    description:
      'Get a list of DLCs, GOTY editions, special editions, companion apps, and other additions for a specific game. Useful for finding all related content for a game, such as expansion packs or remastered versions. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesAdditionsListArgsSchema,
    execute: getGameAdditions,
  },
  {
    name: 'get_game_development_team',
    title: 'Get Game Development Team',
    description:
      'Retrieve a list of individual creators (developers, designers, composers, etc.) who were part of the development team for a specific game. Includes information about their roles and contributions to the game. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesDevelopmentTeamListArgsSchema,
    execute: getGameDevelopmentTeam,
  },
  {
    name: 'get_game_series',
    title: 'Get Game Series',
    description:
      'Get all games that are part of the same series as the specified game. For example, if you query "The Witcher 3", this will return all games in The Witcher series. Useful for discovering related games in a franchise. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesGameSeriesListArgsSchema,
    execute: getGameSeries,
  },
  {
    name: 'get_game_parent_games',
    title: 'Get Game Parent Games',
    description:
      'For DLCs and editions, retrieve the parent/base game. For example, if you query a DLC, this will return the main game it belongs to. Useful for understanding the relationship between base games and their expansions. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesParentGamesListArgsSchema,
    execute: getGameParentGames,
  },
  {
    name: 'get_game_screenshots',
    title: 'Get Game Screenshots',
    description:
      'Retrieve screenshots for a specific game. Returns image URLs, dimensions, and visibility status. Useful for displaying game visuals or building image galleries for game information pages. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "image", "width", "height"]).',
    schema: GamesScreenshotsListArgsSchema,
    execute: getGameScreenshots,
  },
  {
    name: 'get_game_stores',
    title: 'Get Game Store Links',
    description:
      'Get links to digital distribution stores (Steam, Epic Games, PlayStation Store, Xbox Store, etc.) where the game can be purchased. Returns store IDs, game IDs, and direct purchase URLs. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "url", "store_id"]).',
    schema: GamesStoresListArgsSchema,
    execute: getGameStores,
  },
  {
    name: 'get_game_achievements',
    title: 'Get Game Achievements',
    description:
      'Retrieve a list of achievements for a specific game. Includes achievement names, descriptions, images, and completion percentages. Useful for achievement tracking and game completion analysis. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "description", "percent"]).',
    schema: GamesAchievementsReadArgsSchema,
    execute: getGameAchievements,
  },
  {
    name: 'get_game_movies',
    title: 'Get Game Trailers',
    description:
      'Get a list of game trailers and videos. Returns video names, preview images, and video data. Useful for displaying promotional content or video galleries for games. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "preview"]).',
    schema: GamesMoviesReadArgsSchema,
    execute: getGameMovies,
  },
  {
    name: 'get_game_reddit',
    title: 'Get Game Reddit Posts',
    description:
      "Retrieve the most recent posts from the game's subreddit. Includes post titles, text, images, URLs, usernames, and creation dates. Useful for understanding community discussions and sentiment about a game. Use the `fields` parameter to specify which fields to include in the response.",
    schema: GamesRedditReadArgsSchema,
    execute: getGameReddit,
  },
  {
    name: 'get_game_suggested',
    title: 'Get Similar Games',
    description:
      'Get a list of visually similar games based on the specified game. This feature uses visual similarity algorithms to recommend games. Note: Available only for business and enterprise API users. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesSuggestedReadArgsSchema,
    execute: getGameSuggested,
  },
  {
    name: 'get_game_twitch',
    title: 'Get Game Twitch Streams',
    description:
      'Retrieve information about Twitch streams associated with the game. Includes stream details, view counts, thumbnails, and metadata. Useful for tracking game popularity on streaming platforms. Note: Available only for business and enterprise API users. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesTwitchReadArgsSchema,
    execute: getGameTwitch,
  },
  {
    name: 'get_game_youtube',
    title: 'Get Game YouTube Videos',
    description:
      'Get YouTube videos associated with the game. Includes video details, channel information, view counts, like/dislike counts, and thumbnails. Useful for content discovery and video analytics. Note: Available only for business and enterprise API users. Use the `fields` parameter to specify which fields to include in the response.',
    schema: GamesYoutubeReadArgsSchema,
    execute: getGameYoutube,
  },
];
