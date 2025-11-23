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
        className="relative flex items-end gap-3 rounded-3xl border-3 border-black bg-muted/90 p-3 shadow-2xl backdrop-blur-sm"
      >
        <div className="relative flex-1">
            <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Brawler..."
            className="max-h-[200px] min-h-[56px] w-full resize-none rounded-xl border-3 border-black bg-white px-6 py-4 text-xl font-bold font-nunito text-black placeholder:text-gray-400 focus:border-secondary focus:ring-4 focus:ring-secondary/30 focus:outline-none transition-all shadow-inner"
            rows={1}
            disabled={isLoading}
            />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !input.trim()}
          className="mb-1 h-14 w-14 shrink-0 rounded-xl bg-primary text-primary-foreground border-3 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:bg-yellow-400 hover:-translate-y-1 active:translate-y-0 active:shadow-[0_2px_0_0_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none transition-all"
        >
          {isLoading ? (
            <Loader2 className="size-7 animate-spin" />
          ) : (
            <SendHorizontal className="size-7" strokeWidth={3} />
          )}
          <span className="sr-only">Brawl</span>
        </Button>
      </form>
      <div className="mt-3 flex items-center justify-center gap-2 text-xs font-black uppercase italic tracking-widest text-white/80 drop-shadow-md">
        <Zap className="size-4 text-yellow-400 fill-yellow-400 stroke-black stroke-2" />
        <span className="transform -skew-x-12">Power Points not included</span>
      </div>
    </motion.div>
  )
}
