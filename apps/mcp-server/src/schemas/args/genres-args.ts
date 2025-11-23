import { z } from 'zod';

/**
 * Genres API Argument Schemas
 * 
 * Zod schemas for genres endpoint arguments/parameters.
 * Originally generated from rawg-api-openapi.json, manually modified to add defaults.
 */

export const GenresListArgsSchema = z.object({
  ordering: z.string().optional().describe("Which field to use when ordering the results."),
  page: z.number().optional().describe("A page number within the paginated result set."),
  page_size: z.number().default(10).describe("Number of results to return per page. Default: 10."),
});

export const GenresReadArgsSchema = z.object({
  id: z.union([z.string(), z.number()]).describe("A unique integer value identifying this Genre."),
});

