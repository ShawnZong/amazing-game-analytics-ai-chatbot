import { z } from 'zod';
import { GamesListArgsSchema } from '../../../schemas/rawg-generated';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List games with filters
 * 
 * Search and filter games from the RAWG database with extensive filtering options
 * including platforms, genres, tags, developers, publishers, release dates, and more.
 * 
 * @param args - Query parameters for filtering games
 * @param apiKey - Optional API key
 * @returns Paginated list of games
 */
export const listGames = async (
  args: z.infer<typeof GamesListArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games', args as Record<string, unknown>, apiKey);
};

