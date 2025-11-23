"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SendHorizontal, Loader2, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading?: boolean
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`
    }
  }

  React.useEffect(() => {
    adjustHeight()
  }, [input])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return
    onSend(input)
    setInput("")
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.5 }}
      className="mx-auto w-full max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-3 rounded-[2rem] border-4 border-slate-900 bg-slate-800 p-3 shadow-2xl"
      >
        <div className="relative flex-1">
            <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Brawler..."
            className="max-h-[200px] min-h-[56px] w-full resize-none rounded-2xl border-b-4 border-slate-950 bg-slate-900 px-6 py-4 text-lg font-bold text-white placeholder:text-slate-500 focus:border-cyan-500 focus:bg-slate-950 focus:outline-none transition-colors"
            rows={1}
            disabled={isLoading}
            />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="mb-1 h-14 w-14 shrink-0 rounded-2xl bg-yellow-400 text-slate-900 border-b-8 border-r-4 border-yellow-700 shadow-lg hover:bg-yellow-300 hover:-translate-y-1 active:translate-y-1 active:border-b-0 active:mb-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:border-b-8 disabled:active:mb-1"
        >
          {isLoading ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            <SendHorizontal className="size-7" />
          )}
          <span className="sr-only">Brawl</span>
        </Button>
      </form>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase italic tracking-widest text-slate-500">
        <Zap className="size-3 text-yellow-400 fill-yellow-400" />
        <span className="transform -skew-x-12">Power Points not included</span>
      </div>
    </motion.div>
  )
}
