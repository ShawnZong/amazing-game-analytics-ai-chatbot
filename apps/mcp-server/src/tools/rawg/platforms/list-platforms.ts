import { z } from 'zod';
import { PlatformsListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List video game platforms
 *
 * Retrieve a list of all video game platforms available in the RAWG database.
 * Platforms include PlayStation, Xbox, Nintendo, PC, and many more.
 * Use this to discover available platforms for filtering games.
 *
 * @param args - Query parameters for pagination and ordering
 * @param apiKey - Optional API key
 * @returns Paginated list of game platforms
 */
export const listPlatforms = async (
  args: z.infer<typeof PlatformsListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/platforms', args as Record<string, unknown>, apiKey);
};

