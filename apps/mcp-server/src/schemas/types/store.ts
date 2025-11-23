import { z } from 'zod';

/**
 * Store schema for list views
 */
export const StoreSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  domain: z.string().max(255).nullable().optional(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

/**
 * Store schema for single/detail views
 */
export const StoreSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  domain: z.string().max(255).nullable().optional(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

