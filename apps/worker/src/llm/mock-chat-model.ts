import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { BaseMessage, AIMessage, HumanMessage } from '@langchain/core/messages';
import { CallbackManagerForLLMRun } from '@langchain/core/callbacks/manager';
import { ChatResult, ChatGeneration, ChatGenerationChunk } from '@langchain/core/outputs';

/**
 * MockChatModel - A deterministic chat model for testing and development
 *
 * This model is used when OPENAI_API_KEY is not provided.
 * It returns a predefined response to demonstrate the system working
 * without requiring API access.
 *
 * To switch to GPT-4:
 * 1. Set OPENAI_API_KEY environment variable
 * 2. The factory in model-factory.ts will automatically use ChatOpenAI instead
 */
export class MockChatModel extends BaseChatModel {
  constructor(fields?: Record<string, unknown>) {
    super(fields || {});
  }

  _llmType(): string {
    return 'mock';
  }

  /**
   * Generate a mock response
   * This is a simplified implementation for the MVP
   */
  async _generate(
    messages: BaseMessage[],
    _options?: this['ParsedCallOptions'],
    _runManager?: CallbackManagerForLLMRun,
  ): Promise<ChatResult> {
    // Extract the last user message for context-aware mocking
    const lastUserMessage = messages.filter(m => m instanceof HumanMessage).pop();

    const userContent = lastUserMessage?.content?.toString() || '';

    // Generate a more context-aware mock response
    let mockResponse = 'This is a mock response. ';

    // Simple pattern matching for common queries
    if (userContent.toLowerCase().includes('game') || userContent.toLowerCase().includes('title')) {
      mockResponse += 'I would normally fetch game data from the RAWG API here. ';
    } else if (userContent.toLowerCase().includes('genre')) {
      mockResponse += 'I would normally fetch genre information from the RAWG API here. ';
    } else if (userContent.toLowerCase().includes('analysis')) {
      mockResponse += 'I would normally perform data analysis using the available tools here. ';
    } else {
      mockResponse += 'I would normally process your request using real AI here. ';
    }

    mockResponse += 'Replace with GPT-4 via ChatOpenAI when OPENAI_API_KEY is configured.';

    // Create the mock response message
    const generation: ChatGeneration = {
      text: mockResponse,
      message: new AIMessage(mockResponse),
    };

    return {
      generations: [generation],
      llmOutput: {
        tokenUsage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      },
    };
  }

  /**
   * Streaming is not implemented for the mock model
   *
   * TODO: When implementing streaming in the future:
   * 1. Override _streamResponseChunks method
   * 2. Use Server-Sent Events (SSE) in the Worker
   * 3. Update the frontend to handle streamed responses
   */
  async *_streamResponseChunks(
    _messages: BaseMessage[],
    _options: this['ParsedCallOptions'],
    _runManager?: CallbackManagerForLLMRun,
  ): AsyncGenerator<ChatGenerationChunk> {
    throw new Error('Streaming is not supported in the MVP');
  }
}
