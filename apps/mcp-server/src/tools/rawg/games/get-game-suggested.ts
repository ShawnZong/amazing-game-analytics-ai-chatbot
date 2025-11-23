import { z } from 'zod';
import { GamesSuggestedReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get similar games (business/enterprise only)
 *
 * Retrieve a list of visually similar games based on the specified game.
 * This feature uses visual similarity algorithms to recommend games.
 *
 * Note: Available only for business and enterprise API users.
 *
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of similar games
 */
export const getGameSuggested = async (
  args: z.infer<typeof GamesSuggestedReadArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/games/{id}/suggested', args as Record<string, unknown>, apiKey);
};
