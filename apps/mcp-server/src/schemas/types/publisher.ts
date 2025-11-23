import { z } from 'zod';

/**
 * Publisher schema for list views
 */
export const PublisherSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

/**
 * Publisher schema for single/detail views
 */
export const PublisherSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

