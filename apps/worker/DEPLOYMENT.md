# Deployment Guide for RAWG Analytics Worker

This guide walks you through deploying the worker to Cloudflare.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com)
2. **Wrangler CLI**: Already installed (included in devDependencies)
3. **Cloudflare Authentication**: Login via Wrangler

## Pre-Deployment Checklist

### 1. Deploy MCP Server First ⚠️

The worker depends on the MCP server, so deploy it first:

```bash
cd apps/mcp-server
npm run deploy
```

**Note the deployed MCP server URL** (e.g., `https://rawg-mcp-agent.your-subdomain.workers.dev`)

### 2. Update MCP Server URL in Configuration

Update `apps/worker/wrangler.jsonc` with your deployed MCP server URL:

```jsonc
"env": {
  "production": {
    "vars": {
      "MCP_SERVER_URL": "https://your-actual-mcp-server.workers.dev"
    }
  }
}
```

Replace `https://your-actual-mcp-server.workers.dev` with your actual MCP server URL.

### 3. Authenticate with Cloudflare

```bash
cd apps/worker
npx wrangler login
```

This will open a browser to authenticate with Cloudflare.

### 4. (Optional) Set OpenAI API Key Secret

If you want to use GPT-4 instead of the mock model:

```bash
cd apps/worker
npx wrangler secret put OPENAI_API_KEY
```

Enter your OpenAI API key when prompted. This is stored securely as a secret.

**Note**: Without this, the worker will use the mock model (good for testing).

## Deployment Steps

### Step 1: Verify Configuration

```bash
cd apps/worker
npm run type-check
```

Ensure there are no type errors.

### Step 2: Deploy to Cloudflare

```bash
npm run deploy
```

Or deploy to a specific environment:

```bash
# Deploy to production
npx wrangler deploy --env production

# Deploy to dev (if configured)
npx wrangler deploy --env dev
```

### Step 3: Verify Deployment

After deployment, Wrangler will show you the worker URL:
- Example: `https://rawg-analytics-worker.your-subdomain.workers.dev`

Test the health endpoint:
```bash
curl https://rawg-analytics-worker.your-subdomain.workers.dev/
```

You should see service information.

### Step 4: Test the Chat Endpoint

```bash
curl -X POST https://rawg-analytics-worker.your-subdomain.workers.dev/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "messages": [
      { "role": "user", "content": "What are some popular games?" }
    ]
  }'
```

## Post-Deployment

### Update Frontend Configuration

Update your frontend to point to the deployed worker URL:

```typescript
// In your frontend code
const WORKER_URL = 'https://rawg-analytics-worker.your-subdomain.workers.dev';
```

### Monitor Logs

View real-time logs:
```bash
npx wrangler tail
```

### Check Secrets

Verify secrets are set:
```bash
npx wrangler secret list
```

### Update Secrets

To update a secret:
```bash
npx wrangler secret put OPENAI_API_KEY
```

To delete a secret:
```bash
npx wrangler secret delete OPENAI_API_KEY
```

## Troubleshooting

### Worker returns 500 errors

1. Check logs: `npx wrangler tail`
2. Verify MCP server is deployed and accessible
3. Verify MCP_SERVER_URL is correct in wrangler.jsonc

### "Failed to communicate with MCP server"

1. Verify MCP server is deployed
2. Check MCP_SERVER_URL in production environment vars
3. Test MCP server directly: `curl https://your-mcp-server.workers.dev/`

### Mock responses in production

1. Check if OPENAI_API_KEY secret is set: `npx wrangler secret list`
2. If not set, add it: `npx wrangler secret put OPENAI_API_KEY`

## Environment Variables Summary

| Variable | Type | Required | Description |
|----------|------|----------|-------------|
| `MCP_SERVER_URL` | var | Yes | URL of deployed MCP server |
| `OPENAI_API_KEY` | secret | No | OpenAI API key (uses mock if not set) |
| `DEFAULT_MODEL` | var | No | Model name (default: gpt-4o) |
| `MAX_TOKENS` | var | No | Max tokens (default: 2000) |
| `TEMPERATURE` | var | No | Temperature (default: 0.7) |

## Quick Reference

```bash
# Login to Cloudflare
npx wrangler login

# Deploy worker
npm run deploy

# View logs
npx wrangler tail

# List secrets
npx wrangler secret list

# Set secret
npx wrangler secret put OPENAI_API_KEY

# Delete secret
npx wrangler secret delete OPENAI_API_KEY
```

