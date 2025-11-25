import { z } from 'zod';
import { PlatformsListsParentsListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List parent platforms
 *
 * Retrieve a list of parent platforms from the RAWG database.
 * Parent platforms group related platforms together. For example, PlayStation
 * is the parent platform for PS2, PS3, PS4, PS5, etc. Use this to understand
 * platform hierarchies and relationships.
 *
 * @param args - Query parameters for pagination and ordering
 * @param apiKey - Optional API key
 * @returns Paginated list of parent platforms
 */
export const listParentPlatforms = async (
  args: z.infer<typeof PlatformsListsParentsListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/platforms/lists/parents', args as Record<string, unknown>, apiKey);
};

