import { TagsListArgsSchema, TagsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { listTags, getTagDetails } from '../tools/rawg';

/**
 * Tags API Tools
 *
 * Array of MCP tools for the tags endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const TAGS_TOOLS = [
  {
    name: 'list_tags',
    title: 'List Game Tags',
    description:
      'Get a list of all tags available in the RAWG database. Returns tag information including name, slug, games count, and images. Tags are descriptive labels used to categorize games, such as "singleplayer", "multiplayer", "co-op", "action", "rpg", "indie", "horror", "puzzle", and many more. Use this to discover available tags for filtering games or to build tag browsing interfaces.',
    schema: TagsListArgsSchema,
    execute: listTags,
  },
  {
    name: 'get_tag_details',
    title: 'Get Tag Details',
    description:
      'Retrieve detailed information about a specific tag. Includes tag name, slug, description, games count, background image, and language. Use this to get comprehensive information about a particular tag, including statistics about how many games have that tag and a detailed description of what the tag represents. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "description"]).',
    schema: TagsReadArgsSchema,
    execute: getTagDetails,
  },
];

