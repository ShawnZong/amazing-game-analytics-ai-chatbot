import { z } from 'zod';

/**
 * Creators API Argument Schemas
 *
 * Zod schemas for creators endpoint arguments/parameters.
 * Originally generated from rawg-api-openapi.json, manually modified to add defaults.
 */

export const CreatorsListArgsSchema = z.object({
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
});

export const CreatorsReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('A unique integer value identifying this Person.'),
  fields: z
    .array(z.string())
    .optional()
    .describe(
      'Specify which fields to include in the response. Use dot notation for nested fields (e.g., ["id", "name", "games_count"]). If not specified, all fields are returned.',
    ),
});

