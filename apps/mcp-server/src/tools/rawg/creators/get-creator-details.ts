import { z } from 'zod';
import { CreatorsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get creator details
 *
 * Retrieve detailed information about a specific game creator including their name,
 * slug, games count, image background, description, ratings, and more. Use this to learn more
 * about a particular creator and see statistics about games they have contributed to.
 *
 * @param args - Creator ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Creator details
 */
export const getCreatorDetails = async (
  args: z.infer<typeof CreatorsReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/creators/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

