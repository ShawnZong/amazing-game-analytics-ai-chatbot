import { z } from 'zod';
import { GamesMoviesReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get trailers
 * 
 * Retrieve a list of game trailers and videos.
 * Returns video names, preview images, and video data.
 * 
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of game trailers
 */
export const getGameMovies = async (
  args: z.infer<typeof GamesMoviesReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{id}/movies', args as Record<string, unknown>, apiKey);
};

