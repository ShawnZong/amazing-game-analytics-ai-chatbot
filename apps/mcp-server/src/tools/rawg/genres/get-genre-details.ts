import { z } from 'zod';
import { GenresReadArgsSchema } from '../../../schemas/rawg-args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get genre details
 * 
 * Retrieve detailed information about a specific game genre including its name,
 * slug, games count, image background, and description. Use this to learn more
 * about a particular genre and see statistics about games in that genre.
 * 
 * @param args - Genre ID
 * @param apiKey - Optional API key
 * @returns Genre details
 */
export const getGenreDetails = async (
  args: z.infer<typeof GenresReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/genres/{id}', args as Record<string, unknown>, apiKey);
};

