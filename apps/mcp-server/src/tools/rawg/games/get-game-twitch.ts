import { z } from 'zod';
import { GamesTwitchReadArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

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
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{id}/twitch', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};
