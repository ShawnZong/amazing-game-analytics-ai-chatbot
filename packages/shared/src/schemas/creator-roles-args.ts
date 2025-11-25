import { z } from 'zod';

/**
 * Creator Roles API Argument Schemas
 *
 * Zod schemas for creator-roles endpoint arguments/parameters.
 * Originally generated from rawg-api-openapi.json, manually modified to add defaults.
 */

export const CreatorRolesListArgsSchema = z.object({
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().default(10).describe('Number of results to return per page. Default: 10.'),
});

