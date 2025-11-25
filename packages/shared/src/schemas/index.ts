/**
 * Shared Zod Schemas
 * 
 * These schemas are used by:
 * - MCP Server: For request validation
 * - Worker: For LangChain tool definitions
 * - Frontend: For form validation and type inference
 */

// Games endpoint schemas
export * from './games-args';

// Genres endpoint schemas
export * from './genres-args';

// Platforms endpoint schemas
export * from './platforms-args';

// Analysis tool schemas
export * from './analysis-args';
