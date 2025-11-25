import { z } from 'zod';
import { CreatorRolesListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List creator roles
 *
 * Retrieve a list of all creator positions (jobs) available in the RAWG database.
 * Creator roles include positions such as Developer, Designer, Composer, Writer,
 * Artist, Programmer, and other roles that individuals can have in game development.
 * Use this to discover available creator roles for filtering or categorization.
 *
 * @param args - Query parameters for pagination
 * @param apiKey - Optional API key
 * @returns Paginated list of creator roles
 */
export const listCreatorRoles = async (
  args: z.infer<typeof CreatorRolesListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/creator-roles', args as Record<string, unknown>, apiKey);
};

