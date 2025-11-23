import { z } from 'zod';
import { GamesGameSeriesListArgsSchema } from '../../../schemas/rawg-generated';
import { fetchRawgApi } from '../utils/api-client';

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
  apiKey?: string
) => {
  return fetchRawgApi('/games/{game_pk}/game-series', args as Record<string, unknown>, apiKey);
};

