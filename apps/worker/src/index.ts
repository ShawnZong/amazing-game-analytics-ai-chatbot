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
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
  BaseMessage,
} from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { ChatRequestSchema } from './lib/types';
import type { Env, Message } from './lib/types';

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
 * Creates a JSON response with CORS headers
 */
const jsonResponse = (data: unknown, status = 200): Response => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
};

/**
 * Creates an error response
 */
const errorResponse = (code: string, message: string, status = 500): Response => {
  return jsonResponse({ code, message }, status);
};

/**
 * Validates Content-Type header
 */
const validateContentType = (request: Request): Response | null => {
  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    return errorResponse('VALIDATION_ERROR', 'Content-Type must be application/json', 400);
  }
  return null;
};

/**
 * Parses and validates request body
 */
const parseAndValidateRequest = async (
  request: Request,
): Promise<{ messages: Message[] } | Response> => {
  try {
    const body = await request.json();
    const validation = ChatRequestSchema.safeParse(body);

    if (!validation.success) {
      return errorResponse('VALIDATION_ERROR', `Invalid request: ${validation.error.message}`, 400);
    }

    return { messages: validation.data.messages };
  } catch {
    return errorResponse('VALIDATION_ERROR', 'Invalid JSON in request body', 400);
  }
};

/**
 * Creates MCP client and fetches tools
 */
const getMcpTools = async (env: Env): Promise<StructuredToolInterface[]> => {
  const mcpClient = new MultiServerMCPClient({
    mcpServers: {
      rawg: {
        url: `${env.MCP_SERVER_URL ?? 'http://localhost:3000'}/mcp`,
      },
    },
    useStandardContentBlocks: true,
  });

  const tools = await mcpClient.getTools();
  console.log(`Loaded ${tools.length} MCP tools`);

  if (tools.length === 0) {
    throw new Error('No tools found');
  }

  return tools;
};

/**
 * Creates ChatOpenAI model with configuration from environment
 */
const createModel = (env: Env): ChatOpenAI => {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required');
  }

  return new ChatOpenAI({
    openAIApiKey: env.OPENAI_API_KEY,
    modelName: env.DEFAULT_MODEL ?? 'gpt-4o-mini',
    temperature: parseFloat(env.TEMPERATURE ?? '0.7'),
    maxTokens: parseInt(env.MAX_TOKENS ?? '2000', 10),
  });
};

/**
 * Converts messages to LangChain message format
 */
const convertToLangChainMessages = (
  messages: Message[],
): (SystemMessage | HumanMessage | AIMessage)[] => {
  return [
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
};

/**
 * Creates LangGraph workflow for agent execution
 */
const createWorkflow = (model: ChatOpenAI, tools: StructuredToolInterface[]) => {
  const modelWithTools = model.bindTools(tools);
  const toolNode = new ToolNode(tools);

  const llmNode = async (state: typeof MessagesAnnotation.State) => {
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] };
  };

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

  return workflow.compile();
};

/**
 * Extracts tool usage from workflow result messages
 */
const extractToolUsage = (messages: BaseMessage[]): Array<{ name: string; result: unknown }> => {
  const toolsUsed: Array<{ name: string; result: unknown }> = [];
  for (const msg of messages) {
    if (msg instanceof ToolMessage) {
      toolsUsed.push({
        name: msg.name ?? 'unknown',
        result: msg.content,
      });
    }
  }
  return toolsUsed;
};

/**
 * Extracts reply text from final message
 */
const extractReply = (message: BaseMessage): string => {
  const content = message?.content ?? '';
  return typeof content === 'string' ? content : JSON.stringify(content);
};

/**
 * Handles root endpoint
 */
const handleRoot = (): Response => {
  return jsonResponse({
    service: 'RAWG Analytics LLM Worker',
    version: '1.0.0',
    status: 'operational',
  });
};

/**
 * Handles chat endpoint
 */
const handleChat = async (request: Request, env: Env): Promise<Response> => {
  try {
    // Validate Content-Type
    const contentTypeError = validateContentType(request);
    if (contentTypeError) {
      return contentTypeError;
    }

    // Parse and validate request
    const validationResult = await parseAndValidateRequest(request);
    if (validationResult instanceof Response) {
      return validationResult;
    }

    const { messages } = validationResult;
    console.log('Processing chat request', { messageCount: messages.length });

    // Get tools and create model
    const tools = await getMcpTools(env);
    const model = createModel(env);

    // Convert messages and create workflow
    const langChainMessages = convertToLangChainMessages(messages);
    const app = createWorkflow(model, tools);

    // Execute workflow
    const result = await app.invoke({ messages: langChainMessages });

    // Extract response
    const finalMessage = result.messages[result.messages.length - 1];
    const reply = extractReply(finalMessage);
    const toolsUsed = extractToolUsage(result.messages);

    const response: { reply: string; tools?: Array<{ name: string; result: unknown }> } = {
      reply,
    };

    if (toolsUsed.length > 0) {
      response.tools = toolsUsed;
    }

    console.log('Chat response generated successfully');
    return jsonResponse(response);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling chat request', { error: errorMessage });
    return errorResponse(
      'INTERNAL_ERROR',
      'An internal error occurred while processing your request',
    );
  }
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

    // Route handlers
    if (path === '/' && request.method === 'GET') {
      return handleRoot();
    }

    if (path === '/chat' && request.method === 'POST') {
      return await handleChat(request, env);
    }

    // 404 for unknown routes
    return errorResponse('NOT_FOUND', `Route ${path} not found`, 404);
  },
};

export default worker;
