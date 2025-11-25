import { DevelopersListArgsSchema, DevelopersReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { listDevelopers, getDeveloperDetails } from '../tools/rawg';

/**
 * Developers API Tools
 *
 * Array of MCP tools for the developers endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const DEVELOPERS_TOOLS = [
  {
    name: 'list_developers',
    title: 'List Game Developers',
    description:
      'Get a list of all game developers available in the RAWG database. Returns developer information including name, slug, games count, and images. Developers include game development studios and companies such as Valve, CD Projekt Red, Rockstar Games, Naughty Dog, Bethesda, and many more. Use this to discover available developers for filtering games or to build developer browsing interfaces.',
    schema: DevelopersListArgsSchema,
    execute: listDevelopers,
  },
  {
    name: 'get_developer_details',
    title: 'Get Developer Details',
    description:
      'Retrieve detailed information about a specific game developer. Includes developer name, slug, description, games count, background image, and more. Use this to get comprehensive information about a particular developer, including statistics about how many games they have developed and a detailed description of the developer. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "description"]).',
    schema: DevelopersReadArgsSchema,
    execute: getDeveloperDetails,
  },
];

