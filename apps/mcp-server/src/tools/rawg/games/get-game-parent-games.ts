import { z } from 'zod';
import { GamesParentGamesListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get parent games for DLCs
 *
 * For DLCs and editions, retrieve the parent/base game.
 * For example, if you query a DLC, this will return the main game it belongs to.
 *
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of parent games
 */
export const getGameParentGames = async (
  args: z.infer<typeof GamesParentGamesListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/games/{game_pk}/parent-games', args as Record<string, unknown>, apiKey);
};
