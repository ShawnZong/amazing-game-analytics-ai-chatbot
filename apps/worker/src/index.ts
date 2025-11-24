/**
 * Cloudflare Worker - RAWG Analytics LLM Backend
 *
 * Simple LangGraph-based agent following the calculator example pattern.
 * Handles POST /chat requests with MCP tools integration.
 */

import { ChatOpenAI } from '@langchain/openai';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { StateGraph, END, START, MessagesAnnotation } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { HumanMessage, AIMessage, SystemMessage, ToolMessage } from '@langchain/core/messages';
import { ChatRequestSchema } from './lib/types';
import type { Env } from './lib/types';

// System prompt
const SYSTEM_PROMPT = `You are a helpful assistant specializing in video game analytics using the RAWG API.

You have access to tools that can fetch game data, genre information, and perform analysis.

When users ask about games, genres, or gaming trends:
1. Use the available tools to fetch relevant data
2. Analyze the results carefully
3. Provide clear, concise, and informative responses

If you use a tool, explain what data you retrieved and how it answers the user's question.`;

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Main Worker fetch handler
 */
const worker: ExportedHandler<Env> = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Handle root endpoint
    if (path === '/' && request.method === 'GET') {
      return new Response(
        JSON.stringify({
          service: 'RAWG Analytics LLM Worker',
          version: '1.0.0',
          status: 'operational',
        }),
        {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        },
      );
    }

    // Handle chat endpoint
    if (path === '/chat' && request.method === 'POST') {
      try {
        // Validate Content-Type
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          return new Response(
            JSON.stringify({
              code: 'VALIDATION_ERROR',
              message: 'Content-Type must be application/json',
            }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } },
          );
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = ChatRequestSchema.safeParse(body);

        if (!validation.success) {
          return new Response(
            JSON.stringify({
              code: 'VALIDATION_ERROR',
              message: `Invalid request: ${validation.error.message}`,
            }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS } },
          );
        }

        const { messages } = validation.data;

        console.log('Processing chat request', { messageCount: messages.length });

        // Check for OpenAI API key
        if (!env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is required');
        }

        // Create MCP client
        const mcpClient = new MultiServerMCPClient({
          mcpServers: {
            rawg: {
              url: `${env.MCP_SERVER_URL ?? 'http://localhost:3000'}/mcp`,
            },
          },
          useStandardContentBlocks: true,
        });

        // Get tools from MCP server
        const tools = await mcpClient.getTools();
        console.log(`Loaded ${tools.length} MCP tools`);

        if (tools.length === 0) {
          throw new Error('No tools found');
        }

        // Create OpenAI model
        const model = new ChatOpenAI({
          openAIApiKey: env.OPENAI_API_KEY,
          modelName: env.DEFAULT_MODEL || 'gpt-4o-mini',
          temperature: parseFloat(env.TEMPERATURE || '0.7'),
          maxTokens: parseInt(env.MAX_TOKENS || '2000', 10),
        });

        // Bind tools to model
        const modelWithTools = model.bindTools(tools);

        // Create tool node
        const toolNode = new ToolNode(tools);

        // Convert messages to LangChain format
        const langChainMessages = [
          new SystemMessage(SYSTEM_PROMPT),
          ...messages.map(msg => {
            switch (msg.role) {
              case 'system':
                return new SystemMessage(msg.content);
              case 'user':
                return new HumanMessage(msg.content);
              case 'assistant':
                return new AIMessage(msg.content);
              default:
                return new HumanMessage(msg.content);
            }
          }),
        ];

        // Define LLM node
        const llmNode = async (state: typeof MessagesAnnotation.State) => {
          const response = await modelWithTools.invoke(state.messages);
          return { messages: [response] };
        };

        // Create LangGraph workflow
        const workflow = new StateGraph(MessagesAnnotation)
          .addNode('llm', llmNode)
          .addNode('tools', toolNode)
          .addEdge(START, 'llm')
          .addEdge('tools', 'llm')
          .addConditionalEdges('llm', state => {
            const lastMessage = state.messages[state.messages.length - 1];
            const aiMessage = lastMessage as AIMessage;

            if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
              return 'tools';
            }

            return END;
          });

        // Compile and execute workflow
        const app = workflow.compile();
        const result = await app.invoke({
          messages: langChainMessages,
        });

        // Extract final response
        const finalMessage = result.messages[result.messages.length - 1];
        const reply = finalMessage?.content || '';
        const replyText = typeof reply === 'string' ? reply : JSON.stringify(reply);

        // Extract tool usage
        const toolsUsed: Array<{ name: string; result: unknown }> = [];
        for (const msg of result.messages) {
          if (msg instanceof ToolMessage) {
            toolsUsed.push({
              name: msg.name || 'unknown',
              result: msg.content,
            });
          }
        }

        // Build response
        const response: { reply: string; tools?: Array<{ name: string; result: unknown }> } = {
          reply: replyText,
        };

        if (toolsUsed.length > 0) {
          response.tools = toolsUsed;
        }

        console.log('Chat response generated successfully');
        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error handling chat request', { error: errorMessage });

        return new Response(
          JSON.stringify({
            code: 'INTERNAL_ERROR',
            message: 'An internal error occurred while processing your request',
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          },
        );
      }
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ code: 'NOT_FOUND', message: `Route ${path} not found` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
  },
};

export default worker;
