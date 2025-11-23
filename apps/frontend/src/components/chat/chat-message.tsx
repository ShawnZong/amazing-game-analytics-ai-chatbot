"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Message } from "@/types/chat"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={cn(
          "flex size-9 shrink-0 select-none items-center justify-center rounded-full border-2 shadow-lg transition-all",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20"
            : "bg-gradient-to-br from-muted to-muted/80 text-foreground border-border/50"
        )}
      >
        {isUser ? (
          <User className="size-4" />
        ) : (
          <Bot className="size-4" />
        )}
      </motion.div>

      {/* Message bubble */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "flex max-w-[75%] flex-col gap-1.5 rounded-2xl px-4 py-2.5 shadow-md transition-all",
          isUser
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-sm"
            : "bg-card border border-border/50 text-foreground rounded-bl-sm"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </div>
        <div
          className={cn(
            "text-[10px] opacity-70",
            isUser ? "text-right" : "text-left"
          )}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}
