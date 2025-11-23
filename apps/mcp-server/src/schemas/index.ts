/**
 * RAWG API Schemas
 *
 * Re-exports all schema types, API endpoints, and client utilities
 */

// Type schemas
export * from "./types/person";
export * from "./types/developer";
export * from "./types/game";
export * from "./types/platform";
export * from "./types/genre";
export * from "./types/publisher";
export * from "./types/store";
export * from "./types/tag";
export * from "./types/media";
export * from "./types/social";

// Keep backward compatibility with the generated schemas
export * from "./rawg-generated";
