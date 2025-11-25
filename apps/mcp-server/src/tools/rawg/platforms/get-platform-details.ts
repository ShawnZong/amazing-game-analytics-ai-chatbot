import { z } from 'zod';
import { PlatformsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get platform details
 *
 * Retrieve detailed information about a specific game platform including its name,
 * slug, games count, image background, description, and more. Use this to learn more
 * about a particular platform and see statistics about games available on that platform.
 *
 * @param args - Platform ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Platform details
 */
export const getPlatformDetails = async (
  args: z.infer<typeof PlatformsReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/platforms/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

