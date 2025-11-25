import { StoresListArgsSchema, StoresReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { listStores, getStoreDetails } from '../tools/rawg';

/**
 * Stores API Tools
 *
 * Array of MCP tools for the stores endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const STORES_TOOLS = [
  {
    name: 'list_stores',
    title: 'List Game Storefronts',
    description:
      'Get a list of all video game storefronts available in the RAWG database. Returns store information including name, slug, games count, domain, and images. Storefronts include Steam, Epic Games Store, PlayStation Store, Xbox Store, Nintendo eShop, GOG, and many more. Use this to discover available stores for filtering games or to build store browsing interfaces.',
    schema: StoresListArgsSchema,
    execute: listStores,
  },
  {
    name: 'get_store_details',
    title: 'Get Store Details',
    description:
      'Retrieve detailed information about a specific video game storefront. Includes store name, slug, description, games count, domain, background image, and more. Use this to get comprehensive information about a particular store, including statistics about how many games are available on that store and a detailed description of the store. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "domain"]).',
    schema: StoresReadArgsSchema,
    execute: getStoreDetails,
  },
];

