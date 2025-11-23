import { z } from 'zod';
import { GamesStoresListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';
import { selectFieldsFromPaginatedResponse } from '../utils/field-selector';

/**
 * Get store links
 *
 * Retrieve links to digital distribution stores (Steam, Epic Games,
 * PlayStation Store, Xbox Store, etc.) where the game can be purchased.
 *
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of store links
 */
export const getGameStores = async (
  args: z.infer<typeof GamesStoresListArgsSchema>,
  apiKey?: string,
) => {
  const { fields, ...apiArgs } = args;
  const result = await fetchRawgApi('/games/{game_pk}/stores', apiArgs as Record<string, unknown>, apiKey);
  return selectFieldsFromPaginatedResponse(result, fields);
};
