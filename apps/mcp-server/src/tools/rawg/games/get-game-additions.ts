import { z } from 'zod';
import { GamesAdditionsListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get game additions (DLCs, GOTY editions, etc.)
 *
 * Retrieve a list of DLCs, GOTY editions, special editions, companion apps,
 * and other additions for a specific game.
 *
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of game additions
 */
export const getGameAdditions = async (
  args: z.infer<typeof GamesAdditionsListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/games/{game_pk}/additions', args as Record<string, unknown>, apiKey);
};
