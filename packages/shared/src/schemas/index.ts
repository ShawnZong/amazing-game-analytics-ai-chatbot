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

// Stores endpoint schemas
export * from './stores-args';

// Publishers endpoint schemas
export * from './publishers-args';

// Creators endpoint schemas
export * from './creators-args';

// Developers endpoint schemas
export * from './developers-args';

// Analysis tool schemas
export * from './analysis-args';
