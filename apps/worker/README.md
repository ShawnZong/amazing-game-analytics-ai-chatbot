# RAWG Analytics Worker

Cloudflare Worker backend that connects the frontend UI to an LLM runtime via LangChain and to the MCP server for game data tools.

## Features

- 🤖 **LLM Integration**: LangChain-powered agent with conversation memory
- 🔧 **MCP Tools**: Connects to MCP server for RAWG API data access
- 🎭 **Mock Mode**: Works without API keys for development/testing
- 🚀 **GPT-4 Ready**: Switch to real GPT-4 by setting `OPENAI_API_KEY`
- 📦 **One-shot JSON**: Simple request/response (no streaming in MVP)
- 💾 **Session Memory**: Conversation history per session

## Architecture

```
Frontend (Next.js)
    ↓ HTTP POST /chat
Worker (Cloudflare)
    ↓ LangChain Agent
    ├─→ MockChatModel (default)
    │   or ChatOpenAI (with API key)
    │
    └─→ MCP Client (JSON-RPC)
          ↓
        MCP Server
          ↓
        RAWG API
```

## API Endpoints

### POST /chat

Send a message and get an AI response.

**Request:**
```json
{
  "sessionId": "unique-session-id",
  "messages": [
    { "role": "user", "content": "What are popular RPG games?" }
  ]
}
```

**Response:**
```json
{
  "reply": "Here are some popular RPG games...",
  "tools": [
    {
      "name": "list_games",
      "result": { ... }
    }
  ]
}
```

**Error Response:**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request: ..."
}
```

### GET /

Health check and service information.

## Setup

### 1. Install Dependencies

```bash
cd apps/worker
npm install
```

### 2. Configure Environment

Create `.dev.vars` for local development:

```bash
# Optional: Uncomment to use real GPT-4
# OPENAI_API_KEY=sk-...

# MCP Server URL (default: localhost)
MCP_SERVER_URL=http://localhost:3000
```

Edit `wrangler.toml` for production configuration.

### 3. Run Locally

```bash
npm run dev
```

Worker will be available at `http://localhost:8787`

### 4. Test the Endpoint

```bash
curl -X POST http://localhost:8787/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-session",
    "messages": [
      { "role": "user", "content": "List some action games" }
    ]
  }'
```

## Switching to GPT-4

### Local Development

1. Create `.dev.vars`:
```bash
OPENAI_API_KEY=sk-your-key-here
```

2. Restart the worker:
```bash
npm run dev
```

### Production Deployment

1. Set the secret:
```bash
wrangler secret put OPENAI_API_KEY
# Enter your key when prompted
```

2. Deploy:
```bash
npm run deploy
```

**No code changes required!** The `model-factory.ts` automatically switches between mock and real models.

## Available Tools

The agent has access to all 19 tools from your MCP server:

### Games Tools (13 tools)
- `list_games` - Search and filter games with extensive filtering options
- `get_game_details` - Get comprehensive game information
- `get_game_additions` - Get DLCs, special editions, and expansions
- `get_game_development_team` - Get developers, designers, and creators
- `get_game_series` - Get all games in the same series/franchise
- `get_game_parent_games` - Get parent game for DLCs and editions
- `get_game_screenshots` - Get game screenshots and images
- `get_game_stores` - Get purchase links for digital stores
- `get_game_achievements` - Get achievement lists and completion stats
- `get_game_movies` - Get game trailers and videos
- `get_game_reddit` - Get recent Reddit posts about a game
- `get_game_suggested` - Get visually similar game recommendations
- `get_game_twitch` - Get Twitch stream information
- `get_game_youtube` - Get YouTube video content

### Genres Tools (2 tools)
- `list_genres` - List all game genres
- `get_genre_details` - Get detailed genre information

### Analysis Tools (4 tools)
- `execute_calculation` - Perform statistical calculations (mean, median, mode, etc.)
- `compare_groups` - Compare statistics across multiple groups
- `trend_analysis` - Analyze time-series data and trends
- `correlation_analysis` - Calculate correlations between datasets

## Project Structure

```
apps/worker/
├── src/
│   ├── index.ts              # Main worker entry point
│   ├── types.ts              # TypeScript types and schemas
│   ├── constants.ts          # Configuration constants
│   ├── model-factory.ts      # Chat model factory (mock/GPT-4)
│   ├── mock-chat-model.ts    # Mock LLM for development
│   ├── mcp-adapter.ts        # MCP client (JSON-RPC)
│   ├── langchain-tools.ts    # LangChain tools wrapping MCP
│   └── agent.ts              # Agent executor with memory
├── client-example.ts         # Example client usage
├── package.json
├── tsconfig.json
└── wrangler.toml            # Cloudflare configuration
```

## Development

### Type Checking

```bash
npm run type-check
```

### Code Structure

- **index.ts**: HTTP routing and request handling
- **agent.ts**: LangChain agent setup with memory
- **model-factory.ts**: Factory pattern for model selection
- **mcp-adapter.ts**: JSON-RPC client for MCP server
- **langchain-tools.ts**: Tool wrappers for LangChain

## Future Enhancements

### Streaming Support

To add streaming responses:

1. Update `model-factory.ts`:
```typescript
return new ChatOpenAI({
  // ...
  streaming: true,
});
```

2. Update `index.ts` to use Server-Sent Events:
```typescript
const stream = await model.stream(messages);
// Send SSE chunks to client
```

3. Update frontend to handle SSE responses

### Persistent Memory

Replace in-memory session storage with:

- **Cloudflare KV**: For simple key-value storage
- **Durable Objects**: For stateful, long-lived sessions

Example with KV:
```typescript
// In agent.ts
const memory = await env.KV.get(`session:${sessionId}`);
```

### Additional Models

Add support for other LLM providers:

- Anthropic Claude
- Google Gemini
- Cohere
- Open-source models via Replicate

## Troubleshooting

### "MCP server returned 500"

Make sure the MCP server is running:
```bash
cd apps/mcp-server
npm run dev
```

### "Failed to communicate with MCP server"

Check `MCP_SERVER_URL` in `wrangler.toml` or `.dev.vars`.

### Mock responses in production

Make sure `OPENAI_API_KEY` is set:
```bash
wrangler secret list
```

If not set:
```bash
wrangler secret put OPENAI_API_KEY
```

## Deployment

### Deploy to Cloudflare

```bash
npm run deploy
```

### Deploy with Custom Domain

1. Add to `wrangler.toml`:
```toml
routes = [
  { pattern = "api.yourdomain.com", custom_domain = true }
]
```

2. Deploy:
```bash
npm run deploy
```

## License

See root LICENSE file.

## Client Examples

See `client-example.ts` for:
- Simple queries
- Multi-turn conversations
- Error handling
- React integration example

