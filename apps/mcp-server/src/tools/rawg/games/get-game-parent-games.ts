import { z } from 'zod';
import { GamesParentGamesListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFieldsFromPaginatedResponse } from '../utils/field-selector';

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
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{game_pk}/parent-games', apiArgs as Record<string, unknown>, apiKey);
  return selectFieldsFromPaginatedResponse(result, fields);
};
