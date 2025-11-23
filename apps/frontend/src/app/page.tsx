"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { Skull, Star } from "lucide-react"

import { ChatInput } from "@/components/chat/chat-input"
import { ChatList } from "@/components/chat/chat-list"
import { Message, type WorkerMessage } from "@/types/chat"
import { sendChatMessage } from "@/lib/api"

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Generate session ID once and persist it
  const [sessionId] = React.useState(() => {
    // Try to get from localStorage, otherwise generate new
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('chat-session-id')
      if (stored) return stored
      const newId = uuidv4()
      localStorage.setItem('chat-session-id', newId)
      return newId
    }
    return uuidv4()
  })

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Convert frontend messages to worker format
      const workerMessages: WorkerMessage[] = [...messages, userMessage].map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      }))

      // Send to backend worker
      const response = await sendChatMessage(sessionId, workerMessages)

      // Create assistant message from response
      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: response.reply,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Show error message to user
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden">
      {/* Background handled by globals.css */}
      
      {/* Header - Brawl Style */}
      <header className="relative z-10 flex h-24 shrink-0 items-center justify-between border-b-4 border-black/20 bg-secondary/90 px-6 shadow-2xl backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4">
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-yellow-400 border-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Skull className="size-8 text-black drop-shadow-sm" strokeWidth={3} />
            <div className="absolute -top-2 -right-2 text-yellow-300 animate-pulse">
               <Star className="size-6 fill-yellow-200 text-black stroke-2" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-4xl font-lilita tracking-wider text-white brawl-text-outline uppercase transform -skew-x-3 drop-shadow-lg">
              Brawl Stats
            </h1>
            <p className="text-sm font-black text-yellow-300 uppercase tracking-widest brawl-text-outline transform -skew-x-3 -mt-1">
              AI Powered
            </p>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <div className="flex-1 overflow-hidden p-4">
            <ChatList messages={messages} isLoading={isLoading} onSuggestionClick={handleSend} />
          </div>
          
          <div className="p-4 pb-8">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}
