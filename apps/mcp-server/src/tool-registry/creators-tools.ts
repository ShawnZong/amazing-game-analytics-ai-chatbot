import { CreatorsListArgsSchema, CreatorsReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { listCreators, getCreatorDetails } from '../tools/rawg';

/**
 * Creators API Tools
 *
 * Array of MCP tools for the creators endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const CREATORS_TOOLS = [
  {
    name: 'list_creators',
    title: 'List Game Creators',
    description:
      'Get a list of all game creators available in the RAWG database. Returns creator information including name, slug, games count, and images. Creators include individual developers, designers, composers, writers, and other contributors to video games. Use this to discover available creators for filtering games or to build creator browsing interfaces.',
    schema: CreatorsListArgsSchema,
    execute: listCreators,
  },
  {
    name: 'get_creator_details',
    title: 'Get Creator Details',
    description:
      'Retrieve detailed information about a specific game creator. Includes creator name, slug, description, games count, background image, ratings, reviews count, and more. Use this to get comprehensive information about a particular creator, including statistics about how many games they have contributed to and a detailed description of the creator. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "description"]).',
    schema: CreatorsReadArgsSchema,
    execute: getCreatorDetails,
  },
];

