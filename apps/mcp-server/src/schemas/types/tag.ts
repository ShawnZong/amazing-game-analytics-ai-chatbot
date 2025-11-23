import { z } from 'zod';

/**
 * Tag schema for list views
 */
export const TagSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  language: z.string().min(1),
});

/**
 * Tag schema for single/detail views
 */
export const TagSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});
