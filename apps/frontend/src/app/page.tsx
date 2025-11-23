"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { Sword } from "lucide-react"

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
        content: "Chief! I've analyzed the battle data. What are your orders?",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-emerald-500/20 dark:bg-slate-900">
      {/* Background with pattern hint - resembling grass/ground */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-100/40 via-emerald-100/30 to-emerald-200/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 opacity-100" />
      
      {/* Header - Wood/Stone style */}
      <header className="relative z-10 flex h-16 shrink-0 items-center justify-between border-b-4 border-yellow-600/30 bg-orange-100/90 px-6 backdrop-blur-md shadow-lg dark:bg-slate-800/90 dark:border-slate-700">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-[0_4px_0_rgb(180,83,9)] border-2 border-yellow-200">
            <Sword className="size-6 drop-shadow-md" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-yellow-900 drop-shadow-sm dark:text-yellow-100 uppercase">Clash Analytics</h1>
            <p className="text-[11px] font-bold text-yellow-700/80 dark:text-yellow-200/60 uppercase tracking-wider">War Council</p>
          </div>
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
          <div className="flex-1 overflow-hidden">
            <ChatList messages={messages} isLoading={isLoading} onSuggestionClick={handleSend} />
          </div>
          
          <div className="p-4">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </main>
  )
}
