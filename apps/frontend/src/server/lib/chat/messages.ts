/**
 * Message conversion utilities
 */

import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';

// System prompt
export const SYSTEM_PROMPT = `You are a helpful assistant specializing in video game analytics using the RAWG API.

You have access to tools that can fetch game data, genre information, and perform analysis.

When users ask about games, genres, or gaming trends:
1. Use the available tools to fetch relevant data
2. Analyze the results carefully
3. Provide clear, concise, and informative responses

If you use a tool, explain what data you retrieved and how it answers the user's question.`;

/**
 * Converts AI SDK messages to LangChain message format
 */
export function convertToLangChainMessages(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
): (SystemMessage | HumanMessage | AIMessage)[] {
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
}

/**
 * Extracts reply text from final message
 * Handles AIMessage content which can be string, array, or object
 */
export function extractReply(message: { content?: unknown }): string {
  if (!message || message.content === undefined || message.content === null) {
    console.warn('Message has no content', { message });
    return '';
  }

  const content = message.content;

  // If content is a string, return it directly
  if (typeof content === 'string') {
    return content;
  }

  // If content is an array, try to extract text from it
  if (Array.isArray(content)) {
    // Look for text content in the array
    const textParts = content
      .filter(item => item?.type === 'text' || typeof item === 'string')
      .map(item => (typeof item === 'string' ? item : item?.text || ''))
      .filter(text => text.length > 0);

    if (textParts.length > 0) {
      return textParts.join('\n');
    }

    // If no text found, stringify the array
    console.warn('Content is array but no text found', { content });
    return JSON.stringify(content);
  }

  // If content is an object, try to extract text property
  if (typeof content === 'object') {
    if ('text' in content && typeof content.text === 'string') {
      return content.text;
    }
    if ('content' in content) {
      return extractReply({ content: content.content });
    }
    console.warn('Content is object but no text property found', { content });
    return JSON.stringify(content);
  }

  // Fallback: stringify whatever we have
  console.warn('Unexpected content type', { content, type: typeof content });
  return String(content);
}
