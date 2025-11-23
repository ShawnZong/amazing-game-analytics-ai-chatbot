"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-border/50 bg-gradient-to-br from-muted to-muted/80 shadow-lg">
        <Bot className="size-4 text-foreground/60" />
      </div>
      <div className="flex max-w-[75%] flex-col gap-2 rounded-2xl rounded-bl-sm border border-border/50 bg-card px-4 py-3 shadow-md">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-muted-foreground/40"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

