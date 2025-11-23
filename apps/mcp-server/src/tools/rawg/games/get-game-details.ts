import { z } from 'zod';
import { GamesReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get single game details
 *
 * Retrieve comprehensive details about a specific game including description,
 * ratings, release date, platforms, screenshots count, achievements count, and more.
 *
 * @param args - Game ID or slug
 * @param apiKey - Optional API key
 * @returns Game details
 */
export const getGameDetails = async (
  args: z.infer<typeof GamesReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};
