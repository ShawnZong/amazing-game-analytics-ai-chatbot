import { z } from 'zod';
import { PublishersListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List video game publishers
 *
 * Retrieve a list of all video game publishers available in the RAWG database.
 * Publishers include Electronic Arts, Activision, Ubisoft, Nintendo, Sony Interactive
 * Entertainment, Microsoft Studios, and many more. Use this to discover available
 * publishers for filtering games or to build publisher browsing interfaces.
 *
 * @param args - Query parameters for pagination
 * @param apiKey - Optional API key
 * @returns Paginated list of game publishers
 */
export const listPublishers = async (
  args: z.infer<typeof PublishersListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/publishers', args as Record<string, unknown>, apiKey);
};

