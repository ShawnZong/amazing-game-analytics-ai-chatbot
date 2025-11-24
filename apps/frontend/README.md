# RAWG Analytics Frontend

Next.js frontend application for RAWG Analytics with AI-powered chat interface.

## Architecture

The frontend uses:
- **Next.js 15** with App Router
- **AI SDK** (`@ai-sdk/react`) for chat state management
- **LangChain** integrated directly in API routes for LLM processing
- **MCP (Model Context Protocol)** for game data tools
- **Cloudflare Workers** deployment via OpenNext

### Chat Flow

```
Frontend (useChat hook) → /api/chat → LangChain + MCP → AI SDK response
```

The chat functionality uses the AI SDK's `useChat` hook which communicates with the `/api/chat` API route. The API route handles LangChain workflow execution and MCP tool integration directly, eliminating the need for a separate worker service.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Configure environment variables in `wrangler.jsonc`:

- `MCP_SERVER_URL` - URL of the MCP server (required)
- `DEFAULT_MODEL` - OpenAI model to use (default: gpt-4o)
- `MAX_TOKENS` - Maximum tokens for responses (default: 2000)
- `TEMPERATURE` - Model temperature (default: 0.7)
- `OPENAI_API_KEY` - OpenAI API key (set as secret via `wrangler secret put OPENAI_API_KEY`)

## Deployment

Deploy to Cloudflare Workers:

```bash
# Production
npm run deploy:production

# Development
npm run deploy:dev
```

The frontend is deployed using OpenNext for Cloudflare, which packages the Next.js app as a Cloudflare Worker.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [AI SDK Documentation](https://ai-sdk.dev)
- [LangChain Documentation](https://js.langchain.com)
