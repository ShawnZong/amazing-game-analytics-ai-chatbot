import { z } from 'zod';
import { DevelopersListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List game developers
 *
 * Retrieve a list of all game developers available in the RAWG database.
 * Developers include game development studios and companies such as Valve,
 * CD Projekt Red, Rockstar Games, Naughty Dog, and many more. Use this to
 * discover available developers for filtering games or to build developer
 * browsing interfaces.
 *
 * @param args - Query parameters for pagination
 * @param apiKey - Optional API key
 * @returns Paginated list of game developers
 */
export const listDevelopers = async (
  args: z.infer<typeof DevelopersListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/developers', args as Record<string, unknown>, apiKey);
};

