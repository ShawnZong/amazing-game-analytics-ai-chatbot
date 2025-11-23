import { z } from 'zod';

/**
 * Screenshot schema
 */
export const ScreenShotSchema = z.object({
  id: z.number().int(),
  image: z.string().url(),
  hidden: z.boolean().optional(),
  width: z.number().int(),
  height: z.number().int(),
});

/**
 * Movie/Trailer schema
 */
export const MovieSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  preview: z.string().url(),
  data: z.record(z.unknown()),
});

/**
 * Parent achievement schema
 */
export const ParentAchievementSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  percent: z.string(),
});

