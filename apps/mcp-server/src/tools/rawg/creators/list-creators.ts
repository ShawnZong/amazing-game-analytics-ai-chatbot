import { z } from 'zod';
import { CreatorsListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List game creators
 *
 * Retrieve a list of all game creators available in the RAWG database.
 * Creators include individual developers, designers, composers, writers, and other
 * contributors to video games. Use this to discover available creators for filtering
 * games or to build creator browsing interfaces.
 *
 * @param args - Query parameters for pagination
 * @param apiKey - Optional API key
 * @returns Paginated list of game creators
 */
export const listCreators = async (
  args: z.infer<typeof CreatorsListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/creators', args as Record<string, unknown>, apiKey);
};

