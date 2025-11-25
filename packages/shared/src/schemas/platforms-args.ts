import { z } from 'zod';

/**
 * Platforms API Argument Schemas
 *
 * Zod schemas for platforms endpoint arguments/parameters.
 * Originally generated from rawg-api-openapi.json, manually modified to add defaults.
 */

export const PlatformsListArgsSchema = z.object({
  ordering: z.string().optional().describe('Which field to use when ordering the results.'),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
});

export const PlatformsListsParentsListArgsSchema = z.object({
  ordering: z.string().optional().describe('Which field to use when ordering the results.'),
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
});

export const PlatformsReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('A unique integer value identifying this Platform.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "games_count", "platforms.name"]). If not specified, all fields are returned.',
    ),
});

