"use client"

import * as React from "react"
import { Shield, Sparkles } from "lucide-react"

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
        "group flex w-full items-start gap-4 px-2 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-10 shrink-0 select-none items-center justify-center rounded-xl border-2 shadow-lg transition-all",
          isUser
            ? "border-emerald-700 bg-emerald-500 text-white shadow-emerald-900/20"
            : "border-purple-700 bg-purple-500 text-white shadow-purple-900/20"
        )}
      >
        {isUser ? (
          <Shield className="size-5 drop-shadow-md" />
        ) : (
          <Sparkles className="size-5 drop-shadow-md" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          {isUser ? "Chief" : "Analytics Goblin"}
        </div>
        <div
          className={cn(
            "rounded-xl border-b-4 px-5 py-3.5 shadow-md text-sm font-medium leading-relaxed",
            isUser
              ? "border-emerald-700 bg-emerald-100 text-emerald-900 dark:bg-emerald-900/80 dark:text-emerald-50"
              : "border-slate-300 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          )}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
        
        {/* Timestamp */}
        <span className="px-1 text-[10px] font-bold text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-slate-500">
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  )
}
