import { z } from 'zod';
import { GamesAchievementsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

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
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{id}/achievements', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};
