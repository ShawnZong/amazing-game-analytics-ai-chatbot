/**
 * System prompts and configuration constants
 */

/**
 * Default system prompt for the LLM agent
 */
export const DEFAULT_SYSTEM_PROMPT = `You are a helpful assistant specializing in video game analytics using the RAWG API.

You have access to tools that can fetch game data, genre information, and perform analysis.

When users ask about games, genres, or gaming trends:
1. Use the available tools to fetch relevant data
2. Analyze the results carefully
3. Provide clear, concise, and informative responses

If you use a tool, explain what data you retrieved and how it answers the user's question.`;

/**
 * Model configuration
 */
export const MODEL_CONFIG = {
  // GPT-4 model name (used when OPENAI_API_KEY is provided)
  GPT4_MODEL: "gpt-4o",
  
  // Alternative: "gpt-4" for the original GPT-4 model
  // GPT4_MODEL: "gpt-4",
  
  // Default max tokens for responses
  MAX_TOKENS: 2000,
  
  // Default temperature (0-1, higher = more creative)
  TEMPERATURE: 0.7,
} as const;

/**
 * Error codes
 */
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  MCP_ERROR: "MCP_ERROR",
  MODEL_ERROR: "MODEL_ERROR",
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
} as const;

