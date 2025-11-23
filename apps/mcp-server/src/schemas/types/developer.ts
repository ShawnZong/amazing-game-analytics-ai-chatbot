import { z } from 'zod';

/**
 * Developer schema for list views
 */
export const DeveloperSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

/**
 * Developer schema for single/detail views
 */
export const DeveloperSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

