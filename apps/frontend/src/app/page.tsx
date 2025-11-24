"use client"

import * as React from "react"
import { Skull, Star } from "lucide-react"
import { useChat } from "@ai-sdk/react"

import { ChatInput } from "@/components/chat/chat-input"
import { ChatList } from "@/components/chat/chat-list"
import { Message } from "@/types/chat"

export default function Home() {
  const { messages: aiSdkMessages, append, isLoading } = useChat({
    api: "/api/chat",
  })

  // Convert AI SDK messages to our Message format for compatibility with existing components
  const messages: Message[] = React.useMemo(() => {
    return aiSdkMessages.map((msg) => {
      // AI SDK messages have content as string
      const textContent = typeof msg.content === "string" 
        ? msg.content 
        : String(msg.content)

      return {
        id: msg.id,
        role: msg.role === "user" ? "user" : "assistant",
        content: textContent,
        createdAt: new Date(),
      }
    })
  }, [aiSdkMessages])

  const handleSend = (content: string) => {
    append({ role: "user", content })
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
          <div className="flex-1 overflow-hidden p-4 min-h-0">
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
