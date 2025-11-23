import { z } from 'zod';
import { GamesScreenshotsListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get screenshots
 * 
 * Retrieve screenshots for a specific game.
 * Returns image URLs, dimensions, and visibility status.
 * 
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of game screenshots
 */
export const getGameScreenshots = async (
  args: z.infer<typeof GamesScreenshotsListArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{game_pk}/screenshots', args as Record<string, unknown>, apiKey);
};

