import { z } from 'zod';
import { GamePlatformMetacriticSchema } from './platform';

/**
 * Game schema for list views
 */
export const GameSchema = z.object({
  id: z.number().int(),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  name: z.string().min(1),
  released: z.string(),
  tba: z.boolean(),
  background_image: z.string().url(),
  rating: z.number(),
  rating_top: z.number().int(),
  ratings: z.record(z.unknown()),
  ratings_count: z.number().int(),
  reviews_text_count: z.string(),
  added: z.number().int(),
  added_by_status: z.record(z.unknown()),
  metacritic: z.number().int(),
  playtime: z.number().int(),
  suggestions_count: z.number().int(),
  updated: z.string(),
  esrb_rating: z
    .object({
      id: z.number().int().optional(),
      slug: z
        .enum(['everyone', 'everyone-10-plus', 'teen', 'mature', 'adults-only', 'rating-pending'])
        .optional(),
      name: z
        .enum(['Everyone', 'Everyone 10+', 'Teen', 'Mature', 'Adults Only', 'Rating Pending'])
        .optional(),
    })
    .nullable()
    .optional(),
  platforms: z
    .array(
      z
        .object({
          platform: z
            .object({
              id: z.number().int().optional(),
              slug: z.string().optional(),
              name: z.string().optional(),
            })
            .optional(),
          released_at: z.string().nullable().optional(),
          requirements: z
            .object({
              minimum: z.string().optional(),
              recommended: z.string().optional(),
            })
            .nullable()
            .optional(),
        })
        .optional(),
    )
    .optional(),
});

/**
 * Game schema for single/detail views with comprehensive information
 */
export const GameSingleSchema = z.object({
  id: z.number().int(),
  slug: z
    .string()
    .min(1)
    .regex(/^[-a-zA-Z0-9_]+$/),
  name: z.string().min(1),
  name_original: z.string().min(1),
  description: z.string().min(1),
  metacritic: z.number().int(),
  metacritic_platforms: z.array(GamePlatformMetacriticSchema),
  released: z.string(),
  tba: z.boolean(),
  updated: z.string(),
  background_image: z.string().url(),
  background_image_additional: z.string(),
  website: z.string().url().min(1),
  rating: z.number(),
  rating_top: z.number().int(),
  ratings: z.record(z.unknown()),
  reactions: z.record(z.unknown()),
  added: z.number().int(),
  added_by_status: z.record(z.unknown()),
  playtime: z.number().int(),
  screenshots_count: z.number().int(),
  movies_count: z.number().int(),
  creators_count: z.number().int(),
  achievements_count: z.number().int(),
  parent_achievements_count: z.string(),
  reddit_url: z.string().min(1),
  reddit_name: z.string().min(1),
  reddit_description: z.string().min(1),
  reddit_logo: z.string().url().min(1),
  reddit_count: z.number().int(),
  twitch_count: z.string(),
  youtube_count: z.string(),
  reviews_text_count: z.string(),
  ratings_count: z.number().int(),
  suggestions_count: z.number().int(),
  alternative_names: z.array(z.string().min(1).max(200)),
  metacritic_url: z.string().min(1),
  parents_count: z.number().int(),
  additions_count: z.number().int(),
  game_series_count: z.number().int(),
  esrb_rating: z
    .object({
      id: z.number().int().optional(),
      slug: z
        .enum(['everyone', 'everyone-10-plus', 'teen', 'mature', 'adults-only', 'rating-pending'])
        .optional(),
      name: z
        .enum(['Everyone', 'Everyone 10+', 'Teen', 'Mature', 'Adults Only', 'Rating Pending'])
        .optional(),
    })
    .nullable()
    .optional(),
  platforms: z
    .array(
      z
        .object({
          platform: z
            .object({
              id: z.number().int().optional(),
              slug: z.string().optional(),
              name: z.string().optional(),
            })
            .optional(),
          released_at: z.string().nullable().optional(),
          requirements: z
            .object({
              minimum: z.string().optional(),
              recommended: z.string().optional(),
            })
            .nullable()
            .optional(),
        })
        .optional(),
    )
    .optional(),
});

/**
 * Game store information
 */
export const GameStoreFullSchema = z.object({
  id: z.number().int(),
  game_id: z.string(),
  store_id: z.string(),
  url: z.string().url().min(1).max(500),
});
