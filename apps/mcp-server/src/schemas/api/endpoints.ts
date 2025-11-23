import { makeApi } from "@zodios/core";
import { z } from "zod";
import {
  PositionSchema,
  PersonSchema,
  PersonSingleSchema,
  GamePersonListSchema,
} from '../types/person';
import {
  DeveloperSchema,
  DeveloperSingleSchema,
} from '../types/developer';
import {
  GameSchema,
  GameSingleSchema,
  GameStoreFullSchema,
} from '../types/game';
import {
  GenreSchema,
  GenreSingleSchema,
} from '../types/genre';
import {
  PlatformSchema,
  PlatformParentSingleSchema,
  PlatformSingleSchema,
} from '../types/platform';
import {
  PublisherSchema,
  PublisherSingleSchema,
} from '../types/publisher';
import {
  StoreSchema,
  StoreSingleSchema,
} from '../types/store';
import {
  TagSchema,
  TagSingleSchema,
} from '../types/tag';
import {
  ScreenShotSchema,
  MovieSchema,
  ParentAchievementSchema,
} from '../types/media';
import {
  RedditSchema,
  TwitchSchema,
  YoutubeSchema,
} from '../types/social';

/**
 * RAWG API Endpoints
 * Generated from OpenAPI specification
 */
export const endpoints = makeApi([
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
    path: "/platforms/lists/parents",
    alias: "platforms_lists_parents_list",
    description: `For instance, for PS2 and PS4 the "parent platform" is PlayStation.`,
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
  },
]);

