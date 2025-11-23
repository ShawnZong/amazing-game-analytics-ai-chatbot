"use client";

import { User, Bot } from "lucide-react";
import type { ChatMessage as SharedChatMessage } from "@rawg-analytics/shared/types";

interface ChatMessageProps {
  message: SharedChatMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
          <Bot className="size-4 text-white" />
        </div>
      )}
      
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
            : "border border-slate-800 bg-slate-900/50 text-slate-100"
        }`}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
          {message.content}
        </p>
      </div>

      {isUser && (
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
          <User className="size-4 text-slate-400" />
        </div>
      )}
    </div>
  );
}
