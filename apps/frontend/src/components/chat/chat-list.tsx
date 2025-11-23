"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage as SharedChatMessage } from "@rawg-analytics/shared/types";
import { ChatMessage } from "./chat-message";
import { LoadingIndicator } from "./loading-indicator";
import { Gamepad2, Search, TrendingUp, Sparkles } from "lucide-react";

interface ChatListProps {
  messages: SharedChatMessage[];
  isLoading?: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const SUGGESTIONS = [
  {
    icon: TrendingUp,
    label: "Top Games",
    query: "What are the most popular RPG games right now?",
    color: "text-purple-400",
    bg: "bg-purple-500",
  },
  {
    icon: Search,
    label: "Find Games",
    query: "Find me action games released in 2023 for PlayStation 5",
    color: "text-blue-400",
    bg: "bg-blue-500",
  },
  {
    icon: Sparkles,
    label: "Recommendations",
    query: "Recommend games similar to The Witcher 3",
    color: "text-pink-400",
    bg: "bg-pink-500",
  },
  {
    icon: Gamepad2,
    label: "Game Info",
    query: "Tell me about Elden Ring",
    color: "text-green-400",
    bg: "bg-green-500",
  },
];

export function ChatList({ messages, isLoading, onSuggestionClick }: ChatListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8 text-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
            className="flex size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/20"
          >
            <Gamepad2 className="size-12 text-white" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-bold text-white">
              Welcome to RAWG Analytics
            </h2>
            <p className="max-w-md text-slate-400">
              Ask me anything about video games! I can help you discover new titles, analyze trends, and get detailed information.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick?.(suggestion.query)}
              className="group relative flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-left transition-all hover:border-slate-700 hover:bg-slate-900"
            >
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${suggestion.bg} shadow-lg`}>
                <suggestion.icon className="size-5 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">{suggestion.label}</div>
                <div className="text-xs text-slate-500 line-clamp-1">{suggestion.query}</div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={`${index}-${message.content.substring(0, 20)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index === messages.length - 1 ? 0.1 : 0,
              }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <LoadingIndicator />
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  );
}
