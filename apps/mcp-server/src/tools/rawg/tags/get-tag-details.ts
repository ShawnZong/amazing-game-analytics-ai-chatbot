import { z } from 'zod';
import { TagsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get tag details
 *
 * Retrieve detailed information about a specific tag including its name,
 * slug, games count, image background, description, and language. Use this to learn more
 * about a particular tag and see statistics about games that have that tag.
 *
 * @param args - Tag ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Tag details
 */
export const getTagDetails = async (
  args: z.infer<typeof TagsReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/tags/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

