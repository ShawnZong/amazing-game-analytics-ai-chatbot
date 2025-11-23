/**
 * Structured logging utilities
 * 
 * Provides consistent logging format for better observability
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  sessionId?: string;
  requestId?: string;
  [key: string]: unknown;
}

/**
 * Structured logger for consistent log format
 * 
 * @param level - Log level
 * @param message - Log message
 * @param context - Additional context data
 */
function log(level: LogLevel, message: string, context?: LogContext): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  };

  // Use appropriate console method
  switch (level) {
    case 'error':
      console.error(JSON.stringify(logEntry));
      break;
    case 'warn':
      console.warn(JSON.stringify(logEntry));
      break;
    case 'debug':
      // Debug logs are always shown (can be filtered in Cloudflare dashboard)
      console.log(JSON.stringify(logEntry));
      break;
    default:
      console.log(JSON.stringify(logEntry));
  }
}

/**
 * Log info message
 */
export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};

