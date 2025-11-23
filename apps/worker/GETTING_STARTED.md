# Getting Started with the RAWG Analytics Worker

## What Was Built

You now have a complete Cloudflare Worker backend that:

✅ **POST /chat endpoint** - Accepts messages and returns AI responses  
✅ **LangChain integration** - Agent with 19 MCP tools  
✅ **Mock model by default** - Works without API keys  
✅ **GPT-4 ready** - Just add `OPENAI_API_KEY`  
✅ **Session memory** - Conversation history per session  
✅ **Shared schemas** - DRY code via `@rawg-analytics/shared` package  

## Architecture

```
┌─────────────┐
│  Frontend   │
│  (Next.js)  │
└──────┬──────┘
       │ POST /chat
       ▼
┌─────────────────────┐
│  Worker (CF)        │
│  ┌───────────────┐  │
│  │ LangChain     │  │
│  │ Agent         │  │
│  │ ┌───────────┐ │  │
│  │ │MockChat   │ │  │  ← Default (no API key needed)
│  │ │or GPT-4   │ │  │  ← When OPENAI_API_KEY set
│  │ └───────────┘ │  │
│  │               │  │
│  │ ┌───────────┐ │  │
│  │ │19 Tools   │ │  │
│  │ │via MCP    │ │  │
│  │ └───────────┘ │  │
│  └───────────────┘  │
└──────┬──────────────┘
       │ JSON-RPC
       ▼
┌─────────────────────┐
│  MCP Server         │
│  (Cloudflare)       │
└──────┬──────────────┘
       │ HTTPS
       ▼
┌─────────────────────┐
│  RAWG API           │
└─────────────────────┘
```

## Quick Start

### 1. Run the Worker Locally

```bash
cd apps/worker
npm run dev
```

Worker will be available at `http://localhost:8787`

### 2. Test the Endpoint

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "messages": [
      {
        "role": "user",
        "content": "What are some popular RPG games?"
      }
    ]
  }'
```

### 3. Expected Response

```json
{
  "reply": "This is a mock response. I would normally process your request using real AI here. Replace with GPT-4 via ChatOpenAI when OPENAI_API_KEY is configured.",
  "tools": []
}
```

## Upgrading to GPT-4

### For Local Development

1. Create `.dev.vars` in `apps/worker/`:

```bash
cp .dev.vars.example .dev.vars
```

2. Add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
MCP_SERVER_URL=http://localhost:3000
```

3. Restart the worker:

```bash
npm run dev
```

### For Production

1. Deploy and set the secret:

```bash
npm run deploy
wrangler secret put OPENAI_API_KEY
# Paste your key when prompted
```

That's it! The factory in `model-factory.ts` automatically switches from mock to GPT-4.

## Available Tools

The LLM agent has access to **19 tools** from your MCP server:

### Games (13 tools)
- `list_games` - Search games with filters
- `get_game_details` - Full game information
- `get_game_additions` - DLCs and expansions
- `get_game_development_team` - Developers and creators
- `get_game_series` - Games in same franchise
- `get_game_parent_games` - Base game for DLCs
- `get_game_screenshots` - Game images
- `get_game_stores` - Purchase links
- `get_game_achievements` - Achievement lists
- `get_game_movies` - Trailers and videos
- `get_game_reddit` - Community posts
- `get_game_suggested` - Similar games
- `get_game_twitch` - Twitch streams
- `get_game_youtube` - YouTube videos

### Genres (2 tools)
- `list_genres` - All game genres
- `get_genre_details` - Genre information

### Analysis (4 tools)
- `execute_calculation` - Statistical operations
- `compare_groups` - Group comparisons
- `trend_analysis` - Time-series analysis
- `correlation_analysis` - Correlation calculations

## Connecting Your Frontend

Update your frontend to call the worker:

```typescript
// In your chat component
const response = await fetch('http://localhost:8787/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    sessionId: userId, // or generate unique ID
    messages: conversationHistory,
  }),
});

const data = await response.json();
console.log(data.reply); // AI response
console.log(data.tools); // Tools used (if any)
```

See `client-example.ts` for more examples including React integration.

## Project Structure

```
apps/worker/
├── src/
│   ├── index.ts              # Main entry point (POST /chat handler)
│   ├── types.ts              # Request/response types
│   ├── constants.ts          # Config and prompts
│   ├── model-factory.ts      # Mock/GPT-4 switcher
│   ├── mock-chat-model.ts    # Dev/test model
│   ├── mcp-adapter.ts        # MCP JSON-RPC client
│   ├── langchain-tools.ts    # 19 tool wrappers
│   └── agent.ts              # Agent + memory
├── package.json
├── wrangler.toml             # Cloudflare config
└── README.md                 # Full documentation

packages/shared/
├── src/
│   ├── schemas/              # Zod schemas (single source of truth)
│   └── types/                # TypeScript types
└── package.json
```

## Key Features

### 1. Mock Mode (Default)
- Works without any API keys
- Perfect for development and testing
- Returns deterministic responses

### 2. GPT-4 Mode (When OPENAI_API_KEY is set)
- Automatically switches
- No code changes needed
- Full LLM capabilities

### 3. Session Memory
- Each `sessionId` has independent conversation history
- Use `clearSessionMemory(sessionId)` to reset

### 4. Tool Integration
- All 19 MCP tools available to agent
- Automatic tool calling and result formatting
- Tools are described in natural language

### 5. Shared Package
- `@rawg-analytics/shared` provides schemas
- No duplication between worker and MCP server
- Type-safe across the entire stack

## Next Steps

### Enable Streaming (Future)

Currently MVP returns one-shot JSON. To add streaming:

1. Update `model-factory.ts`:
```typescript
return new ChatOpenAI({
  // ...existing config...
  streaming: true,
});
```

2. Update `index.ts` to use Server-Sent Events:
```typescript
const stream = await model.stream(messages);
// Send SSE chunks to client
```

3. Update frontend to handle SSE

### Add Persistent Memory

Replace in-memory storage with:
- **Cloudflare KV**: For simple persistence
- **Durable Objects**: For stateful sessions

### Add More Models

The factory pattern makes it easy:
```typescript
// In model-factory.ts
if (env.ANTHROPIC_API_KEY) {
  return new ChatAnthropic({...});
} else if (env.OPENAI_API_KEY) {
  return new ChatOpenAI({...});
} else {
  return new MockChatModel();
}
```

## Troubleshooting

### "MCP server returned 500"
- Make sure MCP server is running: `cd apps/mcp-server && npm run dev`
- Check `MCP_SERVER_URL` in `.dev.vars`

### "Failed to communicate with MCP server"
- Verify MCP server URL is correct
- Check network connectivity

### Still getting mock responses in production
- Verify secret is set: `wrangler secret list`
- Re-deploy after setting secret: `npm run deploy`

## Git Commits

Three commits were made:

1. **feat(worker)**: Created the worker with all features
2. **feat(shared)**: Created shared package for schemas
3. **refactor(mcp-server)**: Removed redundant schema files

## Resources

- [Worker README](./README.md) - Full documentation
- [Client Examples](./client-example.ts) - Usage examples
- [Shared Package](../../packages/shared/README.md) - Schema documentation
- [LangChain Docs](https://js.langchain.com/) - LangChain reference
- [Wrangler Docs](https://developers.cloudflare.com/workers/wrangler/) - Cloudflare Workers

## Support

If you encounter issues:
1. Check the logs: `wrangler tail` (for deployed workers)
2. Review the README.md in this directory
3. Examine client-example.ts for usage patterns

Happy building! 🚀

