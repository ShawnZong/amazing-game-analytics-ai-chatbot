# Frontend Structure

This document explains the organization of the frontend application.

## Directory Structure

```
apps/frontend/
├── src/                    # Source code (Next.js convention)
│   ├── app/               # App Router pages & layouts
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   └── globals.css    # Global styles
│   │
│   ├── components/        # React components
│   │   ├── chat/          # Chat-related components
│   │   │   ├── chat-input.tsx
│   │   │   ├── chat-list.tsx
│   │   │   ├── chat-message.tsx
│   │   │   └── loading-indicator.tsx
│   │   └── ui/            # Reusable UI components (Shadcn)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── input.tsx
│   │
│   ├── lib/               # Utility functions
│   │   └── utils.ts       # Helper functions (cn, etc.)
│   │
│   └── types/             # TypeScript type definitions
│       └── chat.ts        # Chat types (re-exports from shared)
│
├── public/                # Static assets
│   ├── next.svg
│   ├── vercel.svg
│   └── ...
│
├── .env.example           # Environment variables template
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
├── postcss.config.mjs     # PostCSS configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## Key Conventions

### 1. Src Directory
We use the `src/` directory pattern (Next.js 13+ convention):
- ✅ All source code inside `src/`
- ✅ Keeps root clean and organized
- ✅ Clear separation of source vs config

### 2. App Router
Using Next.js 13+ App Router:
- ✅ `src/app/` for routes and layouts
- ✅ `layout.tsx` for shared layouts
- ✅ `page.tsx` for route pages
- ✅ Server components by default

### 3. Component Organization

**Chat Components** (`src/components/chat/`)
- Domain-specific components
- Related to chat functionality
- Example: `chat-input.tsx`, `chat-list.tsx`

**UI Components** (`src/components/ui/`)
- Reusable, generic components
- From Shadcn UI library
- Example: `button.tsx`, `card.tsx`

### 4. Types
- Use `@rawg-analytics/shared/types` for API types
- Local types in `src/types/` for UI-specific needs
- Re-export shared types for convenience

### 5. Naming Conventions
Following project rules:
- Files: `kebab-case` (e.g., `chat-message.tsx`)
- Components: `PascalCase` (e.g., `ChatMessage`)
- Functions: `camelCase` (e.g., `handleSend`)

## Integration Points

### Worker API
The frontend connects to the Cloudflare Worker backend:

```typescript
const response = await fetch(`${workerUrl}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId,
    messages,
  }),
});
```

### Shared Package
Uses `@rawg-analytics/shared` for type safety:

```typescript
import type { ChatMessage, ChatResponse } from "@rawg-analytics/shared/types";
```

## Removed Redundancies

Previously had duplicate directories - these have been cleaned up:
- ❌ `apps/frontend/apps/frontend/` (nested duplicate)
- ❌ `/app` at root level (conflicted with `/src/app`)
- ❌ `/components` at root level (conflicted with `/src/components`)

## Environment Variables

Create `.env.local` based on `.env.example`:

```bash
NEXT_PUBLIC_WORKER_URL=http://localhost:8787
```

## Best Practices

1. **"use client" directive**
   - Only add to components that use hooks or browser APIs
   - Keep server components when possible for better performance

2. **Component exports**
   - Use named exports: `export function Component()`
   - Matches project naming conventions

3. **Imports**
   - Use `@/` alias for absolute imports
   - Configured in `tsconfig.json`

4. **Styling**
   - Tailwind CSS for styling
   - Dark mode by default
   - Use `cn()` utility for conditional classes

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Future Improvements

- [ ] Add error boundary components
- [ ] Implement proper loading states
- [ ] Add unit tests for components
- [ ] Set up Storybook for component development
- [ ] Add E2E tests with Playwright
- [ ] Implement proper authentication
- [ ] Add offline support with service workers

