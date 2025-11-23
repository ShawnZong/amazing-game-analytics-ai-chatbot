import { z } from 'zod';
import { GamesRedditReadArgsSchema } from '../../../schemas/rawg-args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get Reddit posts
 * 
 * Retrieve the most recent posts from the game's subreddit.
 * Includes post titles, text, images, URLs, usernames, and creation dates.
 * 
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of Reddit posts
 */
export const getGameReddit = async (
  args: z.infer<typeof GamesRedditReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{id}/reddit', args as Record<string, unknown>, apiKey);
};

