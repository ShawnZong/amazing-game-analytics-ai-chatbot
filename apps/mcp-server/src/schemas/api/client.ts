import { Zodios, type ZodiosOptions } from "@zodios/core";
import { endpoints } from './endpoints';

/**
 * Default API client instance
 */
export const api = new Zodios(endpoints);

/**
 * Create a RAWG API client with custom configuration
 * 
 * @param baseUrl - Base URL for the API (defaults to https://api.rawg.io/api)
 * @param options - Optional Zodios configuration options
 * @returns Configured Zodios client instance
 * 
 * @example
 * ```ts
 * const client = createApiClient('https://api.rawg.io/api', {
 *   axiosConfig: {
 *     headers: { 'Authorization': 'Bearer token' }
 *   }
 * });
 * ```
 */
export const createApiClient = (baseUrl: string, options?: ZodiosOptions) => {
  return new Zodios(baseUrl, endpoints, options);
};

