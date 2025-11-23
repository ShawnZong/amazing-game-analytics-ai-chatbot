import { z } from 'zod';
import { GamesListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';
import { selectFieldsFromPaginatedResponse } from '../utils/field-selector';

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
export const listGames = async (args: z.infer<typeof GamesListArgsSchema>, apiKey?: string) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games', apiArgs as Record<string, unknown>, apiKey);
  return selectFieldsFromPaginatedResponse(result, fields);
};
