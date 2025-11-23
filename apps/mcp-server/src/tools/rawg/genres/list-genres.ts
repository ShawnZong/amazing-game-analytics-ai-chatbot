import { z } from 'zod';
import { GenresListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List video game genres
 * 
 * Retrieve a list of all video game genres available in the RAWG database.
 * Genres include Action, Adventure, RPG, Strategy, Puzzle, Shooter, and more.
 * Use this to discover available genres for filtering games.
 * 
 * @param args - Query parameters for pagination and ordering
 * @param apiKey - Optional API key
 * @returns Paginated list of game genres
 */
export const listGenres = async (
  args: z.infer<typeof GenresListArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/genres', args as Record<string, unknown>, apiKey);
};

