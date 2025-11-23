"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SendHorizontal, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = React.useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput("")
  }

  return (
    <motion.form
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full items-center gap-3 border-t border-border/40 bg-background/80 backdrop-blur-sm p-4 shadow-lg"
    >
      <div className="relative flex-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about games, analytics, or trends..."
          className="h-11 rounded-xl border-2 border-border/50 bg-background pr-12 text-base shadow-sm transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={isLoading || !input.trim()}
        className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/90 shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
      >
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <SendHorizontal className="size-4" />
        )}
        <span className="sr-only">Send message</span>
      </Button>
    </motion.form>
  )
}
