import { z } from 'zod';
import { GamesRedditReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

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
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{id}/reddit', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};
