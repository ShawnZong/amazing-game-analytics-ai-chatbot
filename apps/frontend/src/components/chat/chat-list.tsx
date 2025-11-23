"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Message } from "@/types/chat"
import { ChatMessage } from "./chat-message"
import { LoadingIndicator } from "./loading-indicator"
import { Swords, Trophy, Flame, Scroll } from "lucide-react"

interface ChatListProps {
  messages: Message[]
  isLoading?: boolean
  onSuggestionClick?: (suggestion: string) => void
}

const SUGGESTIONS = [
  {
    icon: Swords,
    label: "Top Strategies",
    query: "What are the best attack strategies for Town Hall 12?",
    color: "text-amber-100",
    bg: "bg-amber-600",
    border: "border-amber-800",
    shadow: "shadow-amber-900",
  },
  {
    icon: Flame,
    label: "Trending Bases",
    query: "Show me trending base layouts for Clan War Leagues.",
    color: "text-orange-100",
    bg: "bg-orange-600",
    border: "border-orange-800",
    shadow: "shadow-orange-900",
  },
  {
    icon: Trophy,
    label: "Meta Report",
    query: "Which troops are currently strongest in the meta?",
    color: "text-yellow-100",
    bg: "bg-yellow-600",
    border: "border-yellow-800",
    shadow: "shadow-yellow-900",
  },
  {
    icon: Scroll,
    label: "Upgrade Guide",
    query: "What is the optimal upgrade order for Town Hall 10?",
    color: "text-emerald-100",
    bg: "bg-emerald-600",
    border: "border-emerald-800",
    shadow: "shadow-emerald-900",
  },
]

export function ChatList({ messages, isLoading, onSuggestionClick }: ChatListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-8 p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="flex size-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-white shadow-xl shadow-orange-900/20"
          >
            <Swords className="size-14 text-white drop-shadow-md" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-800 drop-shadow-sm dark:text-slate-100">
              Battle Analytics
            </h2>
            <p className="max-w-md text-base font-medium text-slate-600 dark:text-slate-400">
              Plan your next attack, Chief!
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick?.(suggestion.query)}
              className={`group relative flex items-center gap-3 overflow-hidden rounded-xl border-b-4 ${suggestion.border} ${suggestion.bg} p-4 text-left shadow-lg transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-0 active:border-b-0`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-black/20 ${suggestion.color} shadow-inner`}>
                <suggestion.icon className="size-6 drop-shadow" />
              </div>
              <div className="relative z-10">
                <div className={`font-bold uppercase tracking-wide ${suggestion.color} drop-shadow-sm`}>{suggestion.label}</div>
                <div className={`text-xs font-medium ${suggestion.color} opacity-90`}>Tap to ask</div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
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
            className="pl-4"
          >
            <LoadingIndicator />
          </motion.div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  )
}
