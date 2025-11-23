import { z } from 'zod';
import { GamesYoutubeReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get YouTube videos (business/enterprise only)
 * 
 * Retrieve YouTube videos associated with the game.
 * Includes video details, channel information, view counts,
 * like/dislike counts, and thumbnails.
 * 
 * Note: Available only for business and enterprise API users.
 * 
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of YouTube videos
 */
export const getGameYoutube = async (
  args: z.infer<typeof GamesYoutubeReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{id}/youtube', args as Record<string, unknown>, apiKey);
};

