import { z } from 'zod';
import { GamesStoresListArgsSchema } from '../../../schemas/rawg-args';
import { fetchRawgApi } from '../utils/api-client';

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
  apiKey?: string
) => {
  return fetchRawgApi('/games/{game_pk}/stores', args as Record<string, unknown>, apiKey);
};

