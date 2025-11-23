/**
 * Shared TypeScript Types
 * 
 * Common types used across the monorepo
 */

import { z } from 'zod';
import * as schemas from '../schemas';

/**
 * Message role types for chat
 */
export type MessageRole = 'system' | 'user' | 'assistant';

/**
 * Chat message
 */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/**
 * Chat request
 */
export interface ChatRequest {
  sessionId: string;
  messages: ChatMessage[];
}

/**
 * Tool result
 */
export interface ToolResult {
  name: string;
  result: any;
}

/**
 * Chat response
 */
export interface ChatResponse {
  reply: string;
  tools?: ToolResult[];
}

/**
 * Error response
 */
export interface ErrorResponse {
  code: string;
  message: string;
}

// =============================================================================
// Infer types from Zod schemas
// =============================================================================

// Games
export type GamesListArgs = z.infer<typeof schemas.GamesListArgsSchema>;
export type GamesReadArgs = z.infer<typeof schemas.GamesReadArgsSchema>;
export type GamesAdditionsListArgs = z.infer<typeof schemas.GamesAdditionsListArgsSchema>;
export type GamesDevelopmentTeamListArgs = z.infer<typeof schemas.GamesDevelopmentTeamListArgsSchema>;
export type GamesGameSeriesListArgs = z.infer<typeof schemas.GamesGameSeriesListArgsSchema>;
export type GamesParentGamesListArgs = z.infer<typeof schemas.GamesParentGamesListArgsSchema>;
export type GamesScreenshotsListArgs = z.infer<typeof schemas.GamesScreenshotsListArgsSchema>;
export type GamesStoresListArgs = z.infer<typeof schemas.GamesStoresListArgsSchema>;
export type GamesAchievementsReadArgs = z.infer<typeof schemas.GamesAchievementsReadArgsSchema>;
export type GamesMoviesReadArgs = z.infer<typeof schemas.GamesMoviesReadArgsSchema>;
export type GamesRedditReadArgs = z.infer<typeof schemas.GamesRedditReadArgsSchema>;
export type GamesSuggestedReadArgs = z.infer<typeof schemas.GamesSuggestedReadArgsSchema>;
export type GamesTwitchReadArgs = z.infer<typeof schemas.GamesTwitchReadArgsSchema>;
export type GamesYoutubeReadArgs = z.infer<typeof schemas.GamesYoutubeReadArgsSchema>;

// Genres
export type GenresListArgs = z.infer<typeof schemas.GenresListArgsSchema>;
export type GenresReadArgs = z.infer<typeof schemas.GenresReadArgsSchema>;

// Analysis
export type ExecuteCalculationArgs = z.infer<typeof schemas.ExecuteCalculationArgsSchema>;
export type CompareGroupsArgs = z.infer<typeof schemas.CompareGroupsArgsSchema>;
export type TrendAnalysisArgs = z.infer<typeof schemas.TrendAnalysisArgsSchema>;
export type CorrelationAnalysisArgs = z.infer<typeof schemas.CorrelationAnalysisArgsSchema>;

