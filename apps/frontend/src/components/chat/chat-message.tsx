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
        "group flex w-full items-start gap-3 px-2 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-14 shrink-0 select-none items-center justify-center rounded-xl border-3 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-transform hover:-rotate-6",
          isUser
            ? "bg-secondary text-white"
            : "bg-primary text-black"
        )}
      >
        {isUser ? (
          <Shield className="size-7 drop-shadow-sm" strokeWidth={3} />
        ) : (
          <Star className="size-7 drop-shadow-sm fill-white text-black" strokeWidth={3} />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className={cn("mb-1 flex items-center gap-2 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
            <span className={cn(
                "text-sm font-lilita uppercase tracking-wide brawl-text-outline",
                isUser ? "text-secondary-foreground" : "text-primary"
            )}>
                {isUser ? "You" : "Brawler Bot"}
            </span>
        </div>
        <div
          className={cn(
            "rounded-2xl border-3 border-black px-5 py-3 shadow-[0_6px_0_0_rgba(0,0,0,1)] text-lg font-bold leading-snug transform transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,1)]",
            isUser
              ? "bg-secondary text-white"
              : "bg-white text-black"
          )}
        >
          <div className="whitespace-pre-wrap font-nunito">{message.content}</div>
        </div>
      </div>
    </div>
  )
}
