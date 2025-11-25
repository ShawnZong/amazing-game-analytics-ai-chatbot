/**
 * Message conversion utilities
 */

import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { SYSTEM_PROMPT } from './prompts';

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
 * Handles AIMessage content which is typically a string
 */
export function extractReply(message: { content?: unknown }): string {
  if (!message || message.content === undefined || message.content === null) {
    return '';
  }

  const content = message.content;

  // If content is a string, return it directly (most common case)
  if (typeof content === 'string') {
    return content;
  }

  // Fallback for edge cases: try to extract text from object or stringify
  if (typeof content === 'object' && content !== null) {
    if ('text' in content && typeof content.text === 'string') {
      return content.text;
    }
    return JSON.stringify(content);
  }

  return String(content);
}
