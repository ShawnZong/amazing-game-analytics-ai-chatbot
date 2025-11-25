import { z } from 'zod';
import { TagsListArgsSchema } from '@rawg-analytics/shared/schemas';
import { fetchRawgApi } from '../utils/api-client';

/**
 * List tags
 *
 * Retrieve a list of all tags available in the RAWG database.
 * Tags are descriptive labels used to categorize games, such as "singleplayer",
 * "multiplayer", "co-op", "action", "rpg", "indie", and many more. Use this to
 * discover available tags for filtering games or to build tag browsing interfaces.
 *
 * @param args - Query parameters for pagination
 * @param apiKey - Optional API key
 * @returns Paginated list of tags
 */
export const listTags = async (
  args: z.infer<typeof TagsListArgsSchema>,
  apiKey?: string,
) => {
  return fetchRawgApi('/tags', args as Record<string, unknown>, apiKey);
};

