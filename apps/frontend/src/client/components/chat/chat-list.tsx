"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Message } from "@/client/types/chat"
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
    label: "Top Rated Games",
    query: "What are the highest rated action games released in year 2025?",
    bgColor: "bg-yellow-400",
    hoverColor: "group-hover:bg-yellow-300",
  },
  {
    icon: Star,
    label: "Genre Analysis",
    query: "Compare the average ratings for Action and Strategy genres for games released in year 2025",
    bgColor: "bg-cyan-400",
    hoverColor: "group-hover:bg-cyan-300",
  },
  {
    icon: Zap,
    label: "Game Analysis",
    query: "Provide a summary and key performance metrics for the game Hollow Knight: Silksong.",
    bgColor: "bg-purple-400",
    hoverColor: "group-hover:bg-purple-300",
  },
  {
    icon: Skull,
    label: "Game Discovery",
    query: "Find popular action games with high ratings released from 2022 to 2025",
    bgColor: "bg-emerald-400",
    hoverColor: "group-hover:bg-emerald-300",
  },
]

export function ChatList({ messages, isLoading, onSuggestionClick }: ChatListProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const userScrolledUpRef = React.useRef(false)
  const isScrollingRef = React.useRef(false)
  const lastMessageCountRef = React.useRef(0)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  // Track user scroll behavior
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      // Clear any pending auto-scroll
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
      
      if (isScrollingRef.current) return
      
      const threshold = 150 // pixels from bottom
      const scrollTop = container.scrollTop
      const scrollHeight = container.scrollHeight
      const clientHeight = container.clientHeight
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight
      
      // User has scrolled up if they're more than threshold away from bottom
      // Reset flag if they scroll back to bottom
      userScrolledUpRef.current = distanceFromBottom > threshold
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Auto-scroll when new messages are added
  React.useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    
    const currentMessageCount = messages.length
    const hasNewMessage = currentMessageCount > lastMessageCountRef.current
    lastMessageCountRef.current = currentMessageCount
    
    // Only auto-scroll if there's a new message or loading state changed
    if (!hasNewMessage && !isLoading) return
    
    // Check if the last message is from the user (user just sent a message)
    const lastMessage = messages[messages.length - 1]
    const isUserMessage = lastMessage?.role === "user"
    
    // Always scroll to bottom when user sends a message
    if (isUserMessage) {
      // Reset the user scrolled up flag since user is sending a new message
      userScrolledUpRef.current = false
      
      // Use a small delay to ensure DOM has updated
      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollContainerRef.current) {
          isScrollingRef.current = true
          bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          
          // Reset scrolling flag after animation
          setTimeout(() => {
            isScrollingRef.current = false
          }, 500)
        }
      }, 50)
      return
    }
    
    // For assistant messages, only auto-scroll if user is near the bottom
    const threshold = 150 // pixels from bottom
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    const isNearBottom = distanceFromBottom < threshold
    
    // Only auto-scroll if user is near the bottom and hasn't manually scrolled up
    if (isNearBottom && !userScrolledUpRef.current) {
      // Use a small delay to ensure DOM has updated
      scrollTimeoutRef.current = setTimeout(() => {
        if (scrollContainerRef.current && !userScrolledUpRef.current) {
          isScrollingRef.current = true
          bottomRef.current?.scrollIntoView({ behavior: "smooth" })
          
          // Reset scrolling flag after animation
          setTimeout(() => {
            isScrollingRef.current = false
          }, 500)
        }
      }, 50)
    }
    
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
        scrollTimeoutRef.current = null
      }
    }
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
            className="flex flex-col items-center space-y-2 w-full"
          >
            <h2 className="text-4xl font-lilita text-white brawl-text-outline transform -skew-x-3 drop-shadow-xl tracking-wide text-center w-full">
              I CAN ANSWER ANYTHING AMAZING!
            </h2>
            <p className="text-l font-black text-cyan-300 uppercase tracking-widest brawl-text-outline transform -skew-x-3 text-center w-full">
              Example questions
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SUGGESTIONS.map((suggestion) => (
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
    <div 
      ref={scrollContainerRef} 
      className="flex flex-1 flex-col overflow-y-auto px-4 py-6 min-h-0 h-full"
      style={{ 
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
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
