"use client"

import * as React from "react"
import { Shield, Star } from "lucide-react"

import { cn } from "@/lib/utils"
import { Message } from "@/types/chat"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-4 px-2 py-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-12 shrink-0 select-none items-center justify-center rounded-2xl border-b-4 border-r-2 shadow-lg transition-transform hover:-rotate-12",
          isUser
            ? "border-blue-800 bg-blue-500 text-white shadow-blue-900/50"
            : "border-purple-800 bg-purple-500 text-white shadow-purple-900/50"
        )}
      >
        {isUser ? (
          <Shield className="size-6 drop-shadow-md" />
        ) : (
          <Star className="size-6 drop-shadow-md fill-current" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="mb-1 flex items-center gap-2 px-1">
            <span className={cn(
                "text-xs font-black uppercase italic tracking-wider transform -skew-x-12",
                isUser ? "text-blue-400" : "text-purple-400"
            )}>
                {isUser ? "You" : "Bot"}
            </span>
            <span className="text-[10px] font-bold text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
                {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </span>
        </div>
        <div
          className={cn(
            "rounded-3xl border-b-8 border-r-4 px-6 py-4 shadow-xl text-lg font-bold leading-snug transform transition-all hover:-translate-y-1",
            isUser
              ? "border-blue-800 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-900"
          )}
        >
          <div className="whitespace-pre-wrap drop-shadow-sm">{message.content}</div>
        </div>
      </div>
    </div>
  )
}
