/**
 * POST /api/chat
 *
 * API route that handles chat messages using LangChain and MCP tools.
 * Adapted from worker logic to work directly in Next.js API route.
 * Returns responses compatible with AI SDK format.
 */

import type { Env } from '@/lib/types';
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import type { StructuredToolInterface } from '@langchain/core/tools';
import { END, MessagesAnnotation, START, StateGraph } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { z } from 'zod';

// System prompt
const SYSTEM_PROMPT = `You are a helpful assistant specializing in video game analytics using the RAWG API.

You have access to tools that can fetch game data, genre information, and perform analysis.

When users ask about games, genres, or gaming trends:
1. Use the available tools to fetch relevant data
2. Analyze the results carefully
3. Provide clear, concise, and informative responses

If you use a tool, explain what data you retrieved and how it answers the user's question.`;

// AI SDK message format schema
const AISDKMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const AISDKRequestSchema = z.object({
  messages: z.array(AISDKMessageSchema),
});

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
 * Converts AI SDK messages to LangChain message format
 */
const convertToLangChainMessages = (
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
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
 * Extracts reply text from final message
 */
const extractReply = (message: BaseMessage): string => {
  const content = message?.content ?? '';
  return typeof content === 'string' ? content : JSON.stringify(content);
};

/**
 * Handles chat endpoint
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Get environment from Cloudflare context
    const context = getCloudflareContext();
    if (!context?.env) {
      return Response.json({ error: 'Cloudflare environment not available' }, { status: 500 });
    }

    const env = context.env as CloudflareEnv & Env;

    // Parse and validate request body (AI SDK format)
    const body = await request.json();
    const validation = AISDKRequestSchema.safeParse(body);

    if (!validation.success) {
      return Response.json(
        { error: `Invalid request: ${validation.error.message}` },
        { status: 400 },
      );
    }

    const { messages } = validation.data;
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

    // Return AI SDK compatible response format
    // AI SDK's DefaultChatTransport expects responses with text content
    return Response.json({
      text: reply,
      role: 'assistant',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error handling chat request', { error: errorMessage });
    return Response.json(
      { error: 'An internal error occurred while processing your request' },
      { status: 500 },
    );
  }
}
