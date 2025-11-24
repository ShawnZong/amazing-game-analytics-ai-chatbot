/**
 * Winston logger configuration for Cloudflare Workers
 *
 * Uses console transport only since Cloudflare Workers don't support
 * Node.js file system APIs. Logs are formatted as JSON for better observability.
 */

import winston from 'winston';

/**
 * Winston logger instance configured for Cloudflare Workers
 *
 * Uses console transport with JSON formatting for structured logging.
 * Logs are output to console which Cloudflare Workers captures automatically.
 *
 * Log level can be configured via the LOG_LEVEL environment variable in wrangler.toml
 * or .dev.vars. Defaults to 'info' if not specified.
 */
export const logger = winston.createLogger({
  level: 'info', // Default level; can be overridden via environment variable at runtime
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
  // Don't exit on handled exceptions in Workers environment
  exitOnError: false,
});
