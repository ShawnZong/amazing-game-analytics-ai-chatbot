import { z } from 'zod';

/**
 * Position/Role schema (e.g., game developer, designer, composer)
 */
export const PositionSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
});

/**
 * Person (creator) schema for list views
 */
export const PersonSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  games_count: z.number().int(),
});

/**
 * Person (creator) schema for single/detail views
 */
export const PersonSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  description: z.string().min(1).optional(),
  games_count: z.number().int(),
  reviews_count: z.number().int(),
  rating: z.string(),
  rating_top: z.number().int(),
  updated: z.string(),
});

/**
 * Game person list schema (used in development team endpoints)
 */
export const GamePersonListSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  games_count: z.number().int(),
});
