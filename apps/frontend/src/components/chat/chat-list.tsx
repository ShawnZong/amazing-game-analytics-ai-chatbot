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
    bgColor: "bg-yellow-400",
    hoverColor: "group-hover:bg-yellow-300",
  },
  {
    icon: Star,
    label: "Map Guide",
    query: "Best brawlers for Snake Prairie?",
    bgColor: "bg-cyan-400",
    hoverColor: "group-hover:bg-cyan-300",
  },
  {
    icon: Zap,
    label: "Counter Picks",
    query: "How do I counter Edgar in Showdown?",
    bgColor: "bg-purple-400",
    hoverColor: "group-hover:bg-purple-300",
  },
  {
    icon: Skull,
    label: "Gem Grab Tips",
    query: "Give me advanced tips for Gem Grab mode.",
    bgColor: "bg-emerald-400",
    hoverColor: "group-hover:bg-emerald-300",
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
            className="flex size-32 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-black shadow-[0_10px_0_0_rgba(0,0,0,1)]"
          >
            <Skull className="size-16 text-black drop-shadow-md" strokeWidth={2.5} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="space-y-2"
          >
            <h2 className="text-5xl font-lilita text-white brawl-text-outline transform -skew-x-3 drop-shadow-xl tracking-wide">
              LET'S BRAWL!
            </h2>
            <p className="max-w-md text-xl font-black text-cyan-300 uppercase tracking-widest brawl-text-outline transform -skew-x-3">
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
              className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border-3 border-black bg-white p-4 text-left shadow-[0_6px_0_0_rgba(0,0,0,1)] transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,1)]`}
            >
              <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${suggestion.bgColor} border-3 border-black shadow-sm transform -rotate-3 group-hover:rotate-0 transition-transform`}>
                <suggestion.icon className="size-7 text-black drop-shadow-sm" strokeWidth={2.5} />
              </div>
              <div className="relative z-10">
                <div className={`text-xl font-lilita text-black uppercase tracking-wide`}>{suggestion.label}</div>
                <div className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors">Tap to select</div>
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
