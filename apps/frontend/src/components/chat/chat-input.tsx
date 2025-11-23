"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { SendHorizontal, Loader2, Sparkles } from "lucide-react"

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
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-3xl"
    >
      <form
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 rounded-xl border-4 border-slate-300 bg-slate-200 p-2 shadow-[0_4px_0_#94a3b8] focus-within:ring-2 focus-within:ring-yellow-400 dark:border-slate-700 dark:bg-slate-800 dark:shadow-[0_4px_0_#334155]"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the Chief..."
          className="max-h-[200px] min-h-[44px] w-full resize-none rounded-lg bg-white/50 px-4 py-3 text-base font-medium text-slate-800 placeholder:text-slate-500 focus:outline-none dark:bg-black/20 dark:text-slate-100 dark:placeholder:text-slate-400"
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="mb-0.5 shrink-0 rounded-lg border-b-4 border-emerald-700 bg-emerald-500 text-white shadow-sm transition-all hover:mt-0.5 hover:border-b-2 hover:bg-emerald-400 active:mt-1 active:border-b-0 disabled:opacity-50 disabled:hover:mt-0 disabled:hover:border-b-4"
        >
          {isLoading ? (
            <Loader2 className="size-6 animate-spin drop-shadow-md" />
          ) : (
            <SendHorizontal className="size-6 drop-shadow-md" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-shadow-sm">
        <Sparkles className="size-3 text-yellow-500" />
        <span>Goblin AI may steal your gems (and data)</span>
      </div>
    </motion.div>
  )
}
