"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"
import { Sparkles } from "lucide-react"

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
        content: "This is a mock response from the RAWG Analytics Agent. I can help you analyze game data.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <main className="relative flex h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header with gradient */}
      <header className="relative z-10 flex h-16 items-center border-b border-border/40 bg-background/80 backdrop-blur-sm px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">RAWG Analytics Chat</h1>
            <p className="text-xs text-muted-foreground">AI-powered game analytics assistant</p>
          </div>
        </div>
      </header>
      
      {/* Chat area */}
      <div className="relative flex-1 overflow-hidden">
        <ChatList messages={messages} isLoading={isLoading} />
      </div>
      
      {/* Input area */}
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </main>
  )
}
