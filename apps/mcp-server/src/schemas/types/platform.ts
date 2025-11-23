import { z } from 'zod';

/**
 * Platform schema for list views
 */
export const PlatformSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url(),
  image: z.string().url().nullable(),
  year_start: z.number().int().min(0).max(32767).nullable().optional(),
  year_end: z.number().int().min(0).max(32767).nullable().optional(),
});

/**
 * Platform parent schema (e.g., PlayStation family)
 */
export const PlatformParentSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  platforms: z.array(PlatformSchema),
});

/**
 * Platform schema for single/detail views
 */
export const PlatformSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url(),
  description: z.string().optional(),
  image: z.string().url().nullable(),
  year_start: z.number().int().min(0).max(32767).nullable().optional(),
  year_end: z.number().int().min(0).max(32767).nullable().optional(),
});

/**
 * Game platform Metacritic score information
 */
export const GamePlatformMetacriticSchema = z.object({
  metascore: z.number().int(),
  url: z.string().min(1),
});
