"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { Skull } from "lucide-react"

import { ChatInput } from "@/components/chat/chat-input"
import { ChatList } from "@/components/chat/chat-list"
import { Message } from "@/types/chat"

export default function Home() {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "BRAWL! 🌵 I've analyzed the match data. Ready to rumble?",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-slate-900">
      {/* Background with animated-style gradient */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black opacity-100" />
      
      {/* Animated skull pattern overlay */}
      <div className="absolute inset-0 z-0 opacity-5 bg-[url('/window.svg')] bg-repeat opacity-10 mix-blend-overlay" />
      
      {/* Header - Brawl Style */}
      <header className="relative z-10 flex h-20 shrink-0 items-center justify-between border-b-4 border-slate-950 bg-slate-900/80 px-6 backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-yellow-400 border-b-4 border-r-2 border-yellow-600 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
            <Skull className="size-7 text-slate-900 drop-shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black italic tracking-tighter text-white drop-shadow-md uppercase transform -skew-x-6">Brawl Stats</h1>
            <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest transform -skew-x-6">Trophy Road</p>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <div className="flex-1 overflow-hidden">
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
