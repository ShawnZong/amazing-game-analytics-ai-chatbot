/**
 * Environment variable utilities
 * Handles both local development (process.env) and Cloudflare Workers (context.env)
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { Env } from '@/server/types/env';

// Track if we've already loaded dotenv to avoid loading multiple times
let dotenvLoaded = false;

/**
 * Loads environment variables from .env.local file for local development
 */
function loadLocalEnv(): void {
  if (dotenvLoaded) {
    return;
  }

  try {
    // Try multiple possible paths for .env.local
    const cwd = process.cwd();
    const possiblePaths = [
      resolve(cwd, '.env.local'), // From current working directory (should be apps/frontend when running dev)
      resolve(cwd, 'apps/frontend/.env.local'), // From monorepo root if cwd is project root
    ];

    let loaded = false;
    for (const envPath of possiblePaths) {
      // Use override: true to ensure variables are set even if they exist
      const result = config({ path: envPath, override: true });

      if (!result.error && result.parsed) {
        // Verify the variables are actually in process.env
        if (result.parsed.OPENAI_API_KEY) {
          process.env.OPENAI_API_KEY = result.parsed.OPENAI_API_KEY;
        }
        loaded = true;
        break;
      }
    }

    if (!loaded) {
      console.warn('Warning: Could not find or load .env.local file');
      console.warn(`Tried paths: ${possiblePaths.join(', ')}`);
      console.warn('Make sure you have created a .env.local file in the apps/frontend directory');
    }

    dotenvLoaded = true;
  } catch (error) {
    console.warn(
      'Warning: Error loading .env.local file:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    dotenvLoaded = true; // Mark as loaded to avoid infinite retries
  }
}

/**
 * Gets environment variables from Cloudflare context or falls back to process.env for local development
 */
export function getEnv(): Env {
  const context = getCloudflareContext();

  // If Cloudflare context is available, use it
  if (context?.env) {
    return context.env as CloudflareEnv & Env;
  }

  // Load .env.local for local development
  loadLocalEnv();

  // Fall back to process.env for local development
  const env: Env = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    MCP_SERVER_URL: process.env.MCP_SERVER_URL ?? 'http://localhost:8787',
    DEFAULT_MODEL: process.env.DEFAULT_MODEL,
    MAX_TOKENS: process.env.MAX_TOKENS,
    TEMPERATURE: process.env.TEMPERATURE,
  };

  // Log warning for missing critical variable
  if (!env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY is not set');
  }

  return env;
}
