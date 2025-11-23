import { z } from 'zod';

export const FetchGameDataArgsSchema = z.object({
  // Pagination
  page: z.number().optional().describe('A page number within the paginated result set.'),
  page_size: z.number().optional().describe('Number of results to return per page.'),
  
  // Search
  search: z.string().optional().describe('Search query.'),
  search_precise: z.boolean().optional().describe('Disable fuzziness for the search query.'),
  search_exact: z.boolean().optional().describe('Mark the search query as exact.'),
  
  // Filters
  parent_platforms: z.string().optional().describe('Filter by parent platforms, for example: "1,2,3".'),
  platforms: z.string().optional().describe('Filter by platforms, for example: "4,5".'),
  stores: z.string().optional().describe('Filter by stores, for example: "5,6".'),
  developers: z.string().optional().describe('Filter by developers, for example: "1612,18893" or "valve-software,feral-interactive".'),
  publishers: z.string().optional().describe('Filter by publishers, for example: "354,20987" or "electronic-arts,microsoft-studios".'),
  genres: z.string().optional().describe('Filter by genres, for example: "4,51" or "action,indie".'),
  tags: z.string().optional().describe('Filter by tags, for example: "31,7" or "singleplayer,multiplayer".'),
  creators: z.string().optional().describe('Filter by creators, for example: "78,28" or "cris-velasco,mike-morasky".'),
  dates: z.string().optional().describe('Filter by a release date, for example: "2010-01-01,2018-12-31.1960-01-01,1969-12-31".'),
  updated: z.string().optional().describe('Filter by an update date, for example: "2020-12-01,2020-12-31".'),
  platforms_count: z.number().optional().describe('Filter by platforms count, for example: 1.'),
  metacritic: z.string().optional().describe('Filter by a metacritic rating, for example: "80,100".'),
  
  // Exclusions
  exclude_collection: z.number().optional().describe('Exclude games from a particular collection, for example: 123.'),
  exclude_additions: z.boolean().optional().describe('Exclude additions.'),
  exclude_parents: z.boolean().optional().describe('Exclude games which have additions.'),
  exclude_game_series: z.boolean().optional().describe('Exclude games which included in a game series.'),
  exclude_stores: z.string().optional().describe('Exclude stores, for example: "5,6".'),
  
  // Sorting
  ordering: z.string().optional().describe('Available fields: name, released, added, created, updated, rating, metacritic. You can reverse the sort order adding a hyphen, for example: "-released".'),
});