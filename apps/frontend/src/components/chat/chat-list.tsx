"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Message } from "@/types/chat"
import { ChatMessage } from "./chat-message"
import { LoadingIndicator } from "./loading-indicator"
import { Star, Skull, Zap, Trophy } from "lucide-react"

interface ChatListProps {
  messages: Message[]
  isLoading?: boolean
  onSuggestionClick?: (suggestion: string) => void
}

const SUGGESTIONS = [
  {
    icon: Trophy,
    label: "Meta Brawlers",
    query: "Which Brawlers are S-tier in the current meta?",
    color: "text-yellow-400",
    bg: "bg-yellow-500",
    border: "border-yellow-700",
  },
  {
    icon: Star,
    label: "Map Guide",
    query: "Best brawlers for Snake Prairie?",
    color: "text-cyan-400",
    bg: "bg-cyan-500",
    border: "border-cyan-700",
  },
  {
    icon: Zap,
    label: "Counter Picks",
    query: "How do I counter Edgar in Showdown?",
    color: "text-purple-400",
    bg: "bg-purple-500",
    border: "border-purple-700",
  },
  {
    icon: Skull,
    label: "Gem Grab Tips",
    query: "Give me advanced tips for Gem Grab mode.",
    color: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-700",
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
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
            className="flex size-32 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-orange-500 border-8 border-slate-900 shadow-[0_10px_0_rgba(0,0,0,0.3)]"
          >
            <Skull className="size-16 text-slate-900 drop-shadow-md" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white drop-shadow-[0_4px_0_rgba(0,0,0,1)] transform -skew-x-6">
              Let's Brawl!
            </h2>
            <p className="max-w-md text-lg font-bold text-cyan-400 uppercase tracking-wide drop-shadow-sm">
              Select a mode to start
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SUGGESTIONS.map((suggestion, index) => (
            <button
              key={suggestion.label}
              onClick={() => onSuggestionClick?.(suggestion.query)}
              className={`group relative flex items-center gap-4 overflow-hidden rounded-3xl border-b-8 border-r-4 ${suggestion.border} bg-slate-800 p-5 text-left shadow-xl transition-all hover:-translate-y-1 hover:brightness-110 active:translate-y-1 active:border-b-0 active:mt-2`}
            >
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${suggestion.bg} border-b-4 border-black/20 shadow-inner transform -rotate-6 group-hover:rotate-0 transition-transform`}>
                <suggestion.icon className="size-7 text-white drop-shadow-md" />
              </div>
              <div className="relative z-10">
                <div className={`text-xl font-black uppercase italic tracking-tight text-white transform -skew-x-6 drop-shadow-sm`}>{suggestion.label}</div>
                <div className="text-sm font-bold text-slate-400 line-clamp-1">Tap to select</div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                type: "spring",
                bounce: 0.4,
                duration: 0.6,
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
