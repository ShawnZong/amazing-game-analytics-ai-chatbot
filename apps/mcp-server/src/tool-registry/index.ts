import { GAMES_TOOLS } from './games-tools';
import { GENRES_TOOLS } from './genres-tools';
import { PLATFORMS_TOOLS } from './platforms-tools';
import { ANALYSIS_TOOLS } from './analysis-tools';

/**
 * Combined Tools Registry
 *
 * Combines all endpoint-specific tool arrays into a single TOOLS array
 * for use by the MCP agent. This allows for modular organization while
 * maintaining a single unified interface.
 */

// Combine all tool arrays
export const TOOLS = [...GAMES_TOOLS, ...GENRES_TOOLS, ...PLATFORMS_TOOLS, ...ANALYSIS_TOOLS];
