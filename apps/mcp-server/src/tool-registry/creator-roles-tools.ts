import { CreatorRolesListArgsSchema } from '@rawg-analytics/shared/schemas';
import { listCreatorRoles } from '../tools/rawg';

/**
 * Creator Roles API Tools
 *
 * Array of MCP tools for the creator-roles endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const CREATOR_ROLES_TOOLS = [
  {
    name: 'list_creator_roles',
    title: 'List Creator Roles',
    description:
      'Get a list of all creator positions (jobs) available in the RAWG database. Returns role information including name, slug, and ID. Creator roles include positions such as Developer, Designer, Composer, Writer, Artist, Programmer, Producer, and other roles that individuals can have in game development. Use this to discover available creator roles for filtering, categorization, or understanding the different types of contributions people make to video games.',
    schema: CreatorRolesListArgsSchema,
    execute: listCreatorRoles,
  },
];

