'use client';

import { Skull, Star } from 'lucide-react';
import * as React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { ChatInput } from '@/client/components/chat/chat-input';
import { ChatList } from '@/client/components/chat/chat-list';
import { Message } from '@/client/types/chat';

export function HomePage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare messages for API (convert to simple format)
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({ error: 'Unknown error' }))) as { error?: string };
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { content: string };
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.content || '',
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Optionally add an error message to the UI
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to send message'}`,
        createdAt: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Background handled by globals.css */}

      {/* Header - Brawl Style */}
      <header className="relative z-10 flex h-24 shrink-0 items-center justify-between border-b-4 border-black/20 bg-secondary/90 px-6 shadow-2xl backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-yellow-400 border-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Skull className="size-8 text-black drop-shadow-sm" strokeWidth={3} />
            <div className="absolute -top-2 -right-2 text-yellow-300 animate-pulse">
              <Star className="size-6 fill-yellow-200 text-black stroke-2" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-lilita tracking-wider text-white brawl-text-outline uppercase transform -skew-x-3 drop-shadow-lg">
              Brawl Stats
            </h1>
            <p className="text-sm font-black text-yellow-300 uppercase tracking-widest brawl-text-outline transform -skew-x-3 -mt-1">
              AI Powered
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <div className="flex-1 overflow-hidden p-4 min-h-0">
            <ChatList messages={messages} isLoading={isLoading} onSuggestionClick={handleSend} />
          </div>

          <div className="p-4 pb-8">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
