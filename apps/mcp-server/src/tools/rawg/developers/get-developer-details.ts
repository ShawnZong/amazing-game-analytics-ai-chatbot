import { z } from 'zod';
import { DevelopersReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get developer details
 *
 * Retrieve detailed information about a specific game developer including their name,
 * slug, games count, image background, description, and more. Use this to learn more
 * about a particular developer and see statistics about games they have developed.
 *
 * @param args - Developer ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Developer details
 */
export const getDeveloperDetails = async (
  args: z.infer<typeof DevelopersReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/developers/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

