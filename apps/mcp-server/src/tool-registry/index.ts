import { GAMES_TOOLS } from './games-tools';
import { GENRES_TOOLS } from './genres-tools';
import { PLATFORMS_TOOLS } from './platforms-tools';
import { STORES_TOOLS } from './stores-tools';
import { PUBLISHERS_TOOLS } from './publishers-tools';
import { CREATORS_TOOLS } from './creators-tools';
import { DEVELOPERS_TOOLS } from './developers-tools';
import { CREATOR_ROLES_TOOLS } from './creator-roles-tools';
import { ANALYSIS_TOOLS } from './analysis-tools';

/**
 * Combined Tools Registry
 *
 * Combines all endpoint-specific tool arrays into a single TOOLS array
 * for use by the MCP agent. This allows for modular organization while
 * maintaining a single unified interface.
 */

// Combine all tool arrays
export const TOOLS = [
  ...GAMES_TOOLS,
  ...GENRES_TOOLS,
  ...PLATFORMS_TOOLS,
  ...STORES_TOOLS,
  ...PUBLISHERS_TOOLS,
  ...CREATORS_TOOLS,
  ...DEVELOPERS_TOOLS,
  ...CREATOR_ROLES_TOOLS,
  ...ANALYSIS_TOOLS,
];
