import { z } from 'zod';
import { GamesAdditionsListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';
import { selectFieldsFromPaginatedResponse } from '../utils/field-selector';

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
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{game_pk}/additions', apiArgs as Record<string, unknown>, apiKey);
  return selectFieldsFromPaginatedResponse(result, fields);
};
