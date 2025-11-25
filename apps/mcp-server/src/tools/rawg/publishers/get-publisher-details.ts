import { z } from 'zod';
import { PublishersReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get publisher details
 *
 * Retrieve detailed information about a specific game publisher including its name,
 * slug, games count, image background, description, and more. Use this to learn more
 * about a particular publisher and see statistics about games published by that publisher.
 *
 * @param args - Publisher ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Publisher details
 */
export const getPublisherDetails = async (
  args: z.infer<typeof PublishersReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/publishers/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

