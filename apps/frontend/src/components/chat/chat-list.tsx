"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Message } from "@/types/chat"
import { ChatMessage } from "./chat-message"
import { LoadingIndicator } from "./loading-indicator"

interface ChatListProps {
  messages: Message[]
  isLoading?: boolean
}

export function ChatList({ messages, isLoading }: ChatListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5"
        >
          <svg
            className="size-10 text-primary/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-2"
        >
          <p className="text-lg font-medium text-foreground">Start a conversation</p>
          <p className="max-w-md text-sm text-muted-foreground">
            Ask me anything about games, analytics, or gaming trends. I'm here to help!
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="px-4 py-2"
        >
          <LoadingIndicator />
        </motion.div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
