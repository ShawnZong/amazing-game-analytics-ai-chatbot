import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

// Type Schemas from OpenAPI Definitions
export const PositionSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
});

export const PersonSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  games_count: z.number().int(),
});

export const PersonSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  description: z.string().min(1).optional(),
  games_count: z.number().int(),
  reviews_count: z.number().int(),
  rating: z.string(),
  rating_top: z.number().int(),
  updated: z.string(),
});

export const DeveloperSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

export const DeveloperSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

export const GameSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
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
  esrb_rating: z.object({
    id: z.number().int().optional(),
    slug: z.enum(["everyone", "everyone-10-plus", "teen", "mature", "adults-only", "rating-pending"]).optional(),
    name: z.enum(["Everyone", "Everyone 10+", "Teen", "Mature", "Adults Only", "Rating Pending"]).optional(),
  }).nullable().optional(),
  platforms: z.array(z.object({
    platform: z.object({
    id: z.number().int().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
    released_at: z.string().nullable().optional(),
    requirements: z.object({
    minimum: z.string().optional(),
    recommended: z.string().optional(),
  }).nullable().optional(),
  }).optional()).optional(),
});

export const GamePersonListSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  image: z.string().url(),
  image_background: z.string().url().min(1),
  games_count: z.number().int(),
});

export const ScreenShotSchema = z.object({
  id: z.number().int(),
  image: z.string().url(),
  hidden: z.boolean().optional(),
  width: z.number().int(),
  height: z.number().int(),
});

export const GameStoreFullSchema = z.object({
  id: z.number().int(),
  game_id: z.string(),
  store_id: z.string(),
  url: z.string().url().min(1).max(500),
});

export const GamePlatformMetacriticSchema = z.object({
  metascore: z.number().int(),
  url: z.string().min(1),
});

export const GameSingleSchema = z.object({
  id: z.number().int(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
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
  alternative_names: z.array(z.string().min(1).max(200).optional()),
  metacritic_url: z.string().min(1),
  parents_count: z.number().int(),
  additions_count: z.number().int(),
  game_series_count: z.number().int(),
  esrb_rating: z.object({
    id: z.number().int().optional(),
    slug: z.enum(["everyone", "everyone-10-plus", "teen", "mature", "adults-only", "rating-pending"]).optional(),
    name: z.enum(["Everyone", "Everyone 10+", "Teen", "Mature", "Adults Only", "Rating Pending"]).optional(),
  }).nullable().optional(),
  platforms: z.array(z.object({
    platform: z.object({
    id: z.number().int().optional(),
    slug: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
    released_at: z.string().nullable().optional(),
    requirements: z.object({
    minimum: z.string().optional(),
    recommended: z.string().optional(),
  }).nullable().optional(),
  }).optional()).optional(),
});

export const ParentAchievementSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  percent: z.string(),
});

export const MovieSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1),
  preview: z.string().url(),
  data: z.record(z.unknown()),
});

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

export const GenreSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

export const GenreSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

export const PlatformSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url(),
  image: z.string().url().nullable(),
  year_start: z.number().int().min(0).max(32767).nullable().optional(),
  year_end: z.number().int().min(0).max(32767).nullable().optional(),
});

export const PlatformParentSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  platforms: z.array(PlatformSchema),
});

export const PlatformSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url(),
  description: z.string().optional(),
  image: z.string().url().nullable(),
  year_start: z.number().int().min(0).max(32767).nullable().optional(),
  year_end: z.number().int().min(0).max(32767).nullable().optional(),
});

export const PublisherSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

export const PublisherSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

export const StoreSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  domain: z.string().max(255).nullable().optional(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
});

export const StoreSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  domain: z.string().max(255).nullable().optional(),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

export const TagSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  language: z.string().min(1),
});

export const TagSingleSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).regex(/^[-a-zA-Z0-9_]+$/),
  games_count: z.number().int(),
  image_background: z.string().url().min(1),
  description: z.string().optional(),
});

// API Endpoints
const endpoints = makeApi([
  {
    method: "get",
    path: "/creator-roles",
    alias: "creator-roles_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(PositionSchema),
  }),
  },
  {
    method: "get",
    path: "/creators",
    alias: "creators_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(PersonSchema),
  }),
  },
  {
    method: "get",
    path: "/creators/:id",
    alias: "creators_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: PersonSingleSchema,
  },
  {
    method: "get",
    path: "/developers",
    alias: "developers_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(DeveloperSchema),
  }),
  },
  {
    method: "get",
    path: "/developers/:id",
    alias: "developers_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: DeveloperSingleSchema,
  },
  {
    method: "get",
    path: "/games",
    alias: "games_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "search",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "search_precise",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "search_exact",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "parent_platforms",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "platforms",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "stores",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "developers",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "publishers",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "genres",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "tags",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "creators",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "dates",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "updated",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "platforms_count",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "metacritic",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "exclude_collection",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "exclude_additions",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "exclude_parents",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "exclude_game_series",
        type: "Query",
        schema: z.boolean().optional(),
      },
      {
        name: "exclude_stores",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GameSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/additions",
    alias: "games_additions_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GameSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/development-team",
    alias: "games_development-team_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GamePersonListSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/game-series",
    alias: "games_game-series_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GameSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/parent-games",
    alias: "games_parent-games_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GameSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/screenshots",
    alias: "games_screenshots_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(ScreenShotSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:game_pk/stores",
    alias: "games_stores_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "game_pk",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GameStoreFullSchema),
  }),
  },
  {
    method: "get",
    path: "/games/:id",
    alias: "games_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: GameSingleSchema,
  },
  {
    method: "get",
    path: "/games/:id/achievements",
    alias: "games_achievements_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: ParentAchievementSchema,
  },
  {
    method: "get",
    path: "/games/:id/movies",
    alias: "games_movies_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: MovieSchema,
  },
  {
    method: "get",
    path: "/games/:id/reddit",
    alias: "games_reddit_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: RedditSchema,
  },
  {
    method: "get",
    path: "/games/:id/suggested",
    alias: "games_suggested_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: GameSingleSchema,
  },
  {
    method: "get",
    path: "/games/:id/twitch",
    alias: "games_twitch_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: TwitchSchema,
  },
  {
    method: "get",
    path: "/games/:id/youtube",
    alias: "games_youtube_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: YoutubeSchema,
  },
  {
    method: "get",
    path: "/genres",
    alias: "genres_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(GenreSchema),
  }),
  },
  {
    method: "get",
    path: "/genres/:id",
    alias: "genres_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: GenreSingleSchema,
  },
  {
    method: "get",
    path: "/platforms",
    alias: "platforms_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(PlatformSchema),
  }),
  },
  {
    method: "get",
    path: "/platforms/lists/parents",
    alias: "platforms_lists_parents_list",
    description: "For instance, for PS2 and PS4 the “parent platform” is PlayStation.",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(PlatformParentSingleSchema),
  }),
  },
  {
    method: "get",
    path: "/platforms/:id",
    alias: "platforms_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: PlatformSingleSchema,
  },
  {
    method: "get",
    path: "/publishers",
    alias: "publishers_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(PublisherSchema),
  }),
  },
  {
    method: "get",
    path: "/publishers/:id",
    alias: "publishers_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: PublisherSingleSchema,
  },
  {
    method: "get",
    path: "/stores",
    alias: "stores_list",
    requestFormat: "json",
    parameters: [
      {
        name: "ordering",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(StoreSchema),
  }),
  },
  {
    method: "get",
    path: "/stores/:id",
    alias: "stores_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: StoreSingleSchema,
  },
  {
    method: "get",
    path: "/tags",
    alias: "tags_list",
    requestFormat: "json",
    parameters: [
      {
        name: "page",
        type: "Query",
        schema: z.number().int().optional(),
      },
      {
        name: "page_size",
        type: "Query",
        schema: z.number().int().optional(),
      }
    ],
    response: z.object({
    count: z.number().int(),
    next: z.string().url().nullable().optional(),
    previous: z.string().url().nullable().optional(),
    results: z.array(TagSchema),
  }),
  },
  {
    method: "get",
    path: "/tags/:id",
    alias: "tags_read",
    requestFormat: "json",
    parameters: [
      {
        name: "id",
        type: "Path",
        schema: z.union([z.string(), z.number()]),
      }
    ],
    response: TagSingleSchema,
  }
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
