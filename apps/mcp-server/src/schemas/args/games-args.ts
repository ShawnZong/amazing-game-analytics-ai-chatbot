import { z } from 'zod';

/**
 * Games API Argument Schemas
 *
 * Zod schemas for games endpoint arguments/parameters.
 * Originally generated from rawg-api-openapi.json, manually modified to add defaults.
 */

export const GamesListArgsSchema = z.object({
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  search: z.string().optional().describe('Search query.'),
  search_precise: z.boolean().optional().describe('Disable fuzziness for the search query.'),
  search_exact: z.boolean().optional().describe('Mark the search query as exact.'),
  parent_platforms: z
    .string()
    .optional()
    .describe('Filter by parent platforms, for example: `1,2,3`.'),
  platforms: z.string().optional().describe('Filter by platforms, for example: `4,5`.'),
  stores: z.string().optional().describe('Filter by stores, for example: `5,6`.'),
  developers: z
    .string()
    .optional()
    .describe(
      'Filter by developers, for example: `1612,18893` or `valve-software,feral-interactive`.',
    ),
  publishers: z
    .string()
    .optional()
    .describe(
      'Filter by publishers, for example: `354,20987` or `electronic-arts,microsoft-studios`.',
    ),
  genres: z
    .string()
    .optional()
    .describe('Filter by genres, for example: `4,51` or `action,indie`.'),
  tags: z
    .string()
    .optional()
    .describe('Filter by tags, for example: `31,7` or `singleplayer,multiplayer`.'),
  creators: z
    .string()
    .optional()
    .describe('Filter by creators, for example: `78,28` or `cris-velasco,mike-morasky`.'),
  dates: z
    .string()
    .optional()
    .describe(
      'Filter by a release date, for example: `2010-01-01,2018-12-31.1960-01-01,1969-12-31`.',
    ),
  updated: z
    .string()
    .optional()
    .describe('Filter by an update date, for example: `2020-12-01,2020-12-31`.'),
  platforms_count: z.number().optional().describe('Filter by platforms count, for example: `1`.'),
  metacritic: z
    .string()
    .optional()
    .describe(
      'Filter by a Metacritic rating, for example: `80,100`. Note: Scores can be null. To exclude games with null Metacritic scores, set the lower limit to 0 (e.g., `0,100`). Remember to set the correct ordering before filtering by Metacritic score.',
    ),
  exclude_collection: z
    .number()
    .optional()
    .describe('Exclude games from a particular collection, for example: `123`.'),
  exclude_additions: z.boolean().optional().describe('Exclude additions.'),
  exclude_parents: z.boolean().optional().describe('Exclude games which have additions.'),
  exclude_game_series: z
    .boolean()
    .optional()
    .describe('Exclude games which included in a game series.'),
  exclude_stores: z.string().optional().describe('Exclude stores, for example: `5,6`.'),
  ordering: z
    .string()
    .optional()
    .describe(
      'Available fields: `name`, `released`, `added`, `created`, `updated`, `rating`, `metacritic`. You can reverse the sort order adding a hyphen, for example: `-released`. Note: When ordering by `rating` or `metacritic`, games with null values will be sorted last. Set the correct ordering before filtering by these metrics.',
    ),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesAdditionsListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesDevelopmentTeamListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  ordering: z.string().optional().describe('Which field to use when ordering the results.'),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "slug", "position.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesGameSeriesListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesParentGamesListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesScreenshotsListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  ordering: z.string().optional().describe('Which field to use when ordering the results.'),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "image", "width", "height"]). If not specified, all fields are returned.',
    ),
});

export const GamesStoresListArgsSchema = z.object({
  game_pk: z.union([z.string(), z.number()]),
  ordering: z.string().optional().describe('Which field to use when ordering the results.'),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "url", "store_id"]). If not specified, all fields are returned.',
    ),
});

export const GamesReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesAchievementsReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "description", "percent"]). If not specified, all fields are returned.',
    ),
});

export const GamesMoviesReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "preview"]). If not specified, all fields are returned.',
    ),
});

export const GamesRedditReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "text", "url"]). If not specified, all fields are returned.',
    ),
});

export const GamesSuggestedReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "rating", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

export const GamesTwitchReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields. If not specified, all fields are returned.',
    ),
});

export const GamesYoutubeReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('An ID or a slug identifying this Game.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields. If not specified, all fields are returned.',
    ),
});
