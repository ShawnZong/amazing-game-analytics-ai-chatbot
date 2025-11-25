import { z } from 'zod';
import { StoresListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List video game storefronts
 *
 * Retrieve a list of all video game storefronts available in the RAWG database.
 * Storefronts include Steam, Epic Games Store, PlayStation Store, Xbox Store,
 * Nintendo eShop, and many more. Use this to discover available stores for
 * filtering games or to build store browsing interfaces.
 *
 * @param args - Query parameters for pagination and ordering
 * @param apiKey - Optional API key
 * @returns Paginated list of game storefronts
 */
export const listStores = async (
  args: z.infer<typeof StoresListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/stores', args as Record<string, unknown>, apiKey);
};

