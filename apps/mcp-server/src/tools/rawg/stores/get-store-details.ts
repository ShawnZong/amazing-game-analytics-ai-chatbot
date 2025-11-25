import { z } from 'zod';
import { StoresReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFields } from '../utils/field-selector';

/**
 * Get store details
 *
 * Retrieve detailed information about a specific game storefront including its name,
 * slug, games count, domain, image background, description, and more. Use this to learn more
 * about a particular store and see statistics about games available on that store.
 *
 * @param args - Store ID and optional fields selector
 * @param apiKey - Optional API key
 * @returns Store details
 */
export const getStoreDetails = async (
  args: z.infer<typeof StoresReadArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/stores/{id}', apiArgs as Record<string, unknown>, apiKey);
  return selectFields(result, fields);
};

