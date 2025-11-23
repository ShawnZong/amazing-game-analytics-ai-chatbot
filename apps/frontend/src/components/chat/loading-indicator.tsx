"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function LoadingIndicator() {
  return (
    <div className="flex items-start gap-3 px-2 py-4">
      {/* Bot Avatar */}
      <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary border-3 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)]">
        <Star className="size-7 drop-shadow-sm fill-white text-black" strokeWidth={3} />
      </div>
      
      {/* Loading Bubble */}
      <div className="flex max-w-[75%] flex-col gap-2 rounded-2xl border-3 border-black bg-white px-5 py-4 shadow-[0_6px_0_0_rgba(0,0,0,1)]">
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-3 w-3 rounded-full border-2 border-black"
              style={{
                backgroundColor: i === 0 ? 'var(--color-primary)' : i === 1 ? 'var(--color-secondary)' : 'var(--color-accent)'
              }}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
