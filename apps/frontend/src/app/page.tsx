"use client";

import * as React from "react";
import { Gamepad2 } from "lucide-react";

import { ChatInput } from "@/components/chat/chat-input";
import { ChatList } from "@/components/chat/chat-list";
import type { ChatMessage } from "@rawg-analytics/shared/types";

/**
 * Generate unique ID for messages
 */
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function Home() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [sessionId] = React.useState(() => `session-${Date.now()}`);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      role: "user",
      content,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Replace with actual worker URL when backend is deployed
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || "http://localhost:8787";
      
      const response = await fetch(`${workerUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      
      // Show error message to user
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center gap-3 px-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20">
            <Gamepad2 className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white">RAWG Analytics</h1>
            <p className="text-xs text-slate-400">AI-Powered Game Insights</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatList messages={messages} isLoading={isLoading} onSuggestionClick={handleSend} />
          </div>
          
          <div className="border-t border-slate-800 p-4">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  );
}
