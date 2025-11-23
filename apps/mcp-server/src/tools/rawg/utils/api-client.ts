import axios, { AxiosError } from 'axios';
import { LRUCache } from 'lru-cache';
import logger from '../../../utils/logger';

const BASE_URL = 'https://api.rawg.io/api';

/**
 * LRU Cache for API responses
 * Max 100 items, 1 hour TTL
 */
const cache = new LRUCache<string, Record<string, unknown>>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
});

/**
 * Fetch data from RAWG API with caching and error handling
 * 
 * @param endpoint - API endpoint path (e.g., '/games', '/games/{id}')
 * @param args - Query and path parameters
 * @param apiKey - Optional API key (defaults to RAWG_API_KEY env var)
 * @returns API response data
 * 
 * @example
 * ```ts
 * // List games with search query
 * const games = await fetchRawgApi('/games', { search: 'witcher', page_size: 10 });
 * 
 * // Get game details
 * const game = await fetchRawgApi('/games/{id}', { id: 3328 });
 * ```
 */
export const fetchRawgApi = async (
  endpoint: string,
  args: Record<string, unknown>,
  apiKey?: string
): Promise<Record<string, unknown>> => {
  const API_KEY = apiKey || process.env.RAWG_API_KEY;

  if (!API_KEY) {
    logger.warn('RAWG_API_KEY is not set. Using mock data or failing.');
  }

  // Extract path parameters from endpoint (e.g., {id}, {game_pk})
  let resolvedEndpoint = endpoint;
  const pathParams: string[] = [];
  const pathParamPattern = /\{(\w+)\}/g;
  let match;

  while ((match = pathParamPattern.exec(endpoint)) !== null) {
    const paramName = match[1];
    pathParams.push(paramName);

    const paramValue = args[paramName];
    if (paramValue === undefined || paramValue === null) {
      throw new Error(`Missing required path parameter: ${paramName}`);
    }
    resolvedEndpoint = resolvedEndpoint.replace(`{${paramName}}`, String(paramValue));
  }

  // Filter out path parameters and undefined values, prepare query params
  const params: Record<string, string | number | boolean> = {
    key: API_KEY || '',
  };

  for (const [key, value] of Object.entries(args)) {
    if (!pathParams.includes(key) && value !== undefined && value !== null) {
      params[key] = value as string | number | boolean;
    }
  }

  const cacheKey = `${resolvedEndpoint}:${JSON.stringify(params)}`;

  // Check cache
  if (cache.has(cacheKey)) {
    logger.info(`Serving from cache: ${cacheKey}`);
    return cache.get(cacheKey)!;
  }

  try {
    const response = await axios.get(`${BASE_URL}${resolvedEndpoint}`, {
      params,
    });

    cache.set(cacheKey, response.data as Record<string, unknown>);
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    let responseData: unknown;
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      responseData = axiosError.response?.data;
    }

    logger.error(`Error fetching ${resolvedEndpoint}:`, responseData || errorMessage);
    throw new Error(`Failed to fetch data from ${resolvedEndpoint}: ${errorMessage}`);
  }
};

