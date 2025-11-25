import { PublishersListArgsSchema, PublishersReadArgsSchema } from '@rawg-analytics/shared/schemas';
import { listPublishers, getPublisherDetails } from '../tools/rawg';

/**
 * Publishers API Tools
 *
 * Array of MCP tools for the publishers endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const PUBLISHERS_TOOLS = [
  {
    name: 'list_publishers',
    title: 'List Game Publishers',
    description:
      'Get a list of all video game publishers available in the RAWG database. Returns publisher information including name, slug, games count, and images. Publishers include Electronic Arts, Activision, Ubisoft, Nintendo, Sony Interactive Entertainment, Microsoft Studios, and many more. Use this to discover available publishers for filtering games or to build publisher browsing interfaces.',
    schema: PublishersListArgsSchema,
    execute: listPublishers,
  },
  {
    name: 'get_publisher_details',
    title: 'Get Publisher Details',
    description:
      'Retrieve detailed information about a specific video game publisher. Includes publisher name, slug, description, games count, background image, and more. Use this to get comprehensive information about a particular publisher, including statistics about how many games were published by that publisher and a detailed description of the publisher. Use the `fields` parameter to specify which fields to include in the response (e.g., ["id", "name", "games_count", "description"]).',
    schema: PublishersReadArgsSchema,
    execute: getPublisherDetails,
  },
];

