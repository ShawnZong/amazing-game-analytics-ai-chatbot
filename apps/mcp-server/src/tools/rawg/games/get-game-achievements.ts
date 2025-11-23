import { z } from 'zod';
import { GamesAchievementsReadArgsSchema } from '../../../schemas/rawg-generated';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get achievements
 * 
 * Retrieve a list of achievements for a specific game.
 * Includes achievement names, descriptions, images, and completion percentages.
 * 
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of game achievements
 */
export const getGameAchievements = async (
  args: z.infer<typeof GamesAchievementsReadArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{id}/achievements', args as Record<string, unknown>, apiKey);
};

