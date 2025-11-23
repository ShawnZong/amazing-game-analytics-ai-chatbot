import { z } from 'zod';
import { GamesGameSeriesListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';
import { selectFieldsFromPaginatedResponse } from '../utils/field-selector';

/**
 * Get games in same series
 *
 * Retrieve all games that are part of the same series as the specified game.
 * For example, if you query "The Witcher 3", this will return all games
 * in The Witcher series.
 *
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of games in the series
 */
export const getGameSeries = async (
  args: z.infer<typeof GamesGameSeriesListArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{game_pk}/game-series', apiArgs as Record<string, unknown>, apiKey);
  return selectFieldsFromPaginatedResponse(result, fields);
};
