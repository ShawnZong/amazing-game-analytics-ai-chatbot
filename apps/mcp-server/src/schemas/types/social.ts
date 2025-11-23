import { z } from 'zod';

/**
 * Reddit post schema
 */
export const RedditSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  text: z.string().min(1),
  image: z.string().url().min(1),
  url: z.string().url().min(1),
  username: z.string().min(1),
  username_url: z.string().url().min(1),
  created: z.string(),
});

/**
 * Twitch stream schema
 */
export const TwitchSchema = z.object({
  id: z.number().int(),
  external_id: z.number().int(),
  name: z.string().min(1),
  description: z.string().min(1),
  created: z.string(),
  published: z.string(),
  thumbnail: z.string().url().min(1),
  view_count: z.number().int(),
  language: z.string().min(1),
});

/**
 * YouTube video schema
 */
export const YoutubeSchema = z.object({
  id: z.number().int(),
  external_id: z.string().min(1),
  channel_id: z.string().min(1),
  channel_title: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  created: z.string(),
  view_count: z.number().int(),
  comments_count: z.number().int(),
  like_count: z.number().int(),
  dislike_count: z.number().int(),
  favorite_count: z.number().int(),
  thumbnails: z.record(z.unknown()),
});

