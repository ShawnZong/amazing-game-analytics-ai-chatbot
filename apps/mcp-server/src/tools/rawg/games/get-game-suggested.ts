import { z } from 'zod';
import { GamesSuggestedReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get similar games (business/enterprise only)
 *
 * Retrieve a list of visually similar games based on the specified game.
 * This feature uses visual similarity algorithms to recommend games.
 *
 * Note: Available only for business and enterprise API users.
 *
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns List of similar games
 */
export const getGameSuggested = async (
  args: z.infer<typeof GamesSuggestedReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{id}/suggested', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};
