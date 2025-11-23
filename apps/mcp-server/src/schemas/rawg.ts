import { z } from 'zod';

export const FetchGameDataArgsSchema = z.object({
  dates: z.string().optional().describe('Range of dates to filter by, formatted as "YYYY-MM-DD,YYYY-MM-DD"'),
  platforms: z.string().optional().describe('Comma-separated list of platform IDs (e.g. "4" for PC, "18" for PlayStation 4)'),
  genres: z.string().optional().describe('Comma-separated list of genre slugs (e.g. "action", "indie")'),
  ordering: z.string().optional().describe('Field to order by (e.g. "-metacritic", "released")'),
  page_size: z.number().optional().default(20).describe('Number of results to return'),
  page: z.number().optional().default(1).describe('Page number'),
});