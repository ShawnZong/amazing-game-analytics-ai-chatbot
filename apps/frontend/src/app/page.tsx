"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"

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
    <main className="flex h-screen w-full flex-col bg-background">
      <header className="flex h-14 items-center border-b px-6">
        <h1 className="text-lg font-semibold">RAWG Analytics Chat</h1>
      </header>
      <div className="flex-1 overflow-hidden">
        <ChatList messages={messages} />
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </main>
  )
}
