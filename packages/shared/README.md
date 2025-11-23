# @rawg-analytics/shared

Shared package containing types, schemas, and utilities used across the RAWG Analytics monorepo.

## Purpose

This package eliminates code duplication by providing a single source of truth for:

- **Zod Schemas**: Request/response validation schemas
- **TypeScript Types**: Shared interfaces and type definitions
- **Utilities**: Common helper functions (future)

## Usage

### In MCP Server

```typescript
import {
  GamesListArgsSchema,
  GenresListArgsSchema,
  ExecuteCalculationArgsSchema,
} from '@rawg-analytics/shared/schemas';
```

### In Worker

```typescript
import {
  GamesListArgsSchema,
  ChatRequest,
  ChatResponse,
} from '@rawg-analytics/shared';
```

### In Frontend

```typescript
import type { ChatMessage, ChatResponse } from '@rawg-analytics/shared/types';
```

## Structure

```
packages/shared/
├── src/
│   ├── index.ts              # Main entry point
│   ├── schemas/
│   │   ├── index.ts          # All Zod schemas
│   │   ├── games-args.ts     # Games endpoint schemas
│   │   ├── genres-args.ts    # Genres endpoint schemas
│   │   └── analysis-args.ts  # Analysis tool schemas
│   └── types/
│       └── index.ts          # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## Benefits

1. **Single Source of Truth**: Schemas defined once, used everywhere
2. **Type Safety**: TypeScript types inferred from Zod schemas
3. **Consistency**: Same validation rules across all apps
4. **Maintainability**: Update schema in one place, propagates to all consumers
5. **Monorepo Best Practice**: Follows standard workspace patterns

## Development

```bash
# Type check
cd packages/shared
npm run type-check
```

## Adding New Schemas

1. Create or update schema file in `src/schemas/`
2. Export from `src/schemas/index.ts`
3. Add inferred type to `src/types/index.ts`
4. Use across the monorepo!

