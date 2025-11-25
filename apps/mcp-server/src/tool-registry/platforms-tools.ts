import {
  PlatformsListArgsSchema,
  PlatformsListsParentsListArgsSchema,
  PlatformsReadArgsSchema,
} from '@rawg-analytics/shared/schemas';
import { listPlatforms, listParentPlatforms, getPlatformDetails } from '../tools/rawg';

/**
 * Platforms API Tools
 *
 * Array of MCP tools for the platforms endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const PLATFORMS_TOOLS = [
  {
    name: 'list_platforms',
    title: 'List Game Platforms',
    description:
      'Get a list of all video game platforms available in the RAWG database. Returns platform information including name, slug, games count, and images. Platforms include PlayStation, Xbox, Nintendo, PC, iOS, Android, and many more. Use this to discover available platforms for filtering games or to build platform browsing interfaces.',
    schema: PlatformsListArgsSchema,
    execute: listPlatforms,
  },
  {
    name: 'list_parent_platforms',
    title: 'List Parent Platforms',
    description:
      'Get a list of parent platforms from the RAWG database. Parent platforms group related platforms together. For example, PlayStation is the parent platform for PS2, PS3, PS4, PS5, etc. Xbox is the parent for Xbox 360, Xbox One, Xbox Series X/S. Use this to understand platform hierarchies and relationships between different console generations.',
    schema: PlatformsListsParentsListArgsSchema,
    execute: listParentPlatforms,
  },
  {
    name: 'get_platform_details',
    title: 'Get Platform Details',
    description:
      'Retrieve detailed information about a specific video game platform. Includes platform name, slug, description, games count, background image, and more. Use this to get comprehensive information about a particular platform, including statistics about how many games are available on that platform and a detailed description of the platform. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "description"]).',
    schema: PlatformsReadArgsSchema,
    execute: getPlatformDetails,
  },
];

