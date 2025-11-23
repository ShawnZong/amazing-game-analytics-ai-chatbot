import { z } from 'zod';
import { GamesDevelopmentTeamListArgsSchema } from '../../../schemas/args';
import { fetchRawgApi } from '../utils/api-client';

/**
 * Get development team
 * 
 * Retrieve a list of individual creators (developers, designers, composers, etc.)
 * who were part of the development team for a specific game.
 * 
 * @param args - Game ID/slug and pagination parameters
 * @param apiKey - Optional API key
 * @returns List of development team members
 */
export const getGameDevelopmentTeam = async (
  args: z.infer<typeof GamesDevelopmentTeamListArgsSchema>,
  apiKey?: string
) => {
  return fetchRawgApi('/games/{game_pk}/development-team', args as Record<string, unknown>, apiKey);
};

