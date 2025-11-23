import { z } from 'zod';
import { GamesTwitchReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get Twitch streams (business/enterprise only)
 * 
 * Retrieve information about Twitch streams associated with the game.
 * Includes stream details, view counts, thumbnails, and metadata.
 * 
 * Note: Available only for business and enterprise API users.
 * 
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of Twitch streams
 */
export const getGameTwitch = async (
  args: z.infer<typeof GamesTwitchReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{id}/twitch', args as Record<string, unknown>, apiKey);
};

