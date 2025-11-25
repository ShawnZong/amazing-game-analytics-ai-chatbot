/**
 * Environment bindings for Cloudflare Worker runtime
 * Used in API routes to access environment variables
 */
export interface Env {
  OPENAI_API_KEY?: string;
  MCP_SERVER_URL: string;
  DEFAULT_MODEL?: string;
  MAX_TOKENS?: string;
  TEMPERATURE?: string;
}
