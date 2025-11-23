import { GenresListArgsSchema, GenresReadArgsSchema } from '../schemas/args';
import { listGenres, getGenreDetails } from '../tools/rawg';

/**
 * Genres API Tools
 *
 * Array of MCP tools for the genres endpoint.
 * Each tool includes name, title, description, schema, and execute function.
 */
export const GENRES_TOOLS = [
  {
    name: 'list_genres',
    title: 'List Game Genres',
    description:
      'Get a list of all video game genres available in the RAWG database. Returns genre information including name, slug, games count, and images. Genres include Action, Adventure, RPG, Strategy, Puzzle, Shooter, and many more. Use this to discover available genres for filtering games or to build genre browsing interfaces.',
    schema: GenresListArgsSchema,
    execute: listGenres,
  },
  {
    name: 'get_genre_details',
    title: 'Get Genre Details',
    description:
      'Retrieve detailed information about a specific video game genre. Includes genre name, slug, description, games count, and background image. Use this to get comprehensive information about a particular genre, including statistics about how many games belong to that genre and a detailed description of what defines the genre.',
    schema: GenresReadArgsSchema,
    execute: getGenreDetails,
  },
];
