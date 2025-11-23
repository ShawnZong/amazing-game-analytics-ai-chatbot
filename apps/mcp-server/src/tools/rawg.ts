import axios, { AxiosError } from 'axios';
import { LRUCache } from 'lru-cache';
import { z } from 'zod';
import {
  FetchGameDataArgsSchema
} from '../schemas';
import logger from '../utils/logger';

type FetchGameDataArgs = z.infer<typeof FetchGameDataArgsSchema>;

const BASE_URL = 'https://api.rawg.io/api';

// Configure Cache: Max 100 items, 1 hour TTL
// We use 'any' here because LRUCache expects a non-nullable type for value,
// but API responses can be arbitrary objects. 'unknown' doesn't satisfy '{}'.
// Using a broad object type is safer than 'any' but still flexible.
const cache = new LRUCache<string, Record<string, unknown>>({
  max: 100,
  ttl: 1000 * 60 * 60, 
});

const fetchRawgApi = async (endpoint: string, args: Record<string, unknown>, apiKey?: string) => {
  // Try to get API key from parameter, then fall back to process.env for local dev
  const API_KEY = apiKey || process.env.RAWG_API_KEY;
  
  if (!API_KEY) {
    logger.warn('RAWG_API_KEY is not set. Using mock data or failing.');
  }

  const cacheKey = `${endpoint}:${JSON.stringify(args)}`;

  if (cache.has(cacheKey)) {
    logger.info(`Serving from cache: ${cacheKey}`);
    return cache.get(cacheKey);
  }

  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params: {
        key: API_KEY,
        ...args,
      },
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

    logger.error(`Error fetching ${endpoint}:`, responseData || errorMessage);
    throw new Error(`Failed to fetch data from ${endpoint}: ${errorMessage}`);
  }
};

export const fetchGameData = async (args: FetchGameDataArgs, apiKey?: string) => {
  return fetchRawgApi('/games', args as Record<string, unknown>, apiKey);
};

