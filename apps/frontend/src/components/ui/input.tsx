import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 opacity-20 blur transition duration-200 group-focus-within:opacity-40" />
        <input
          type={type}
          className={cn(
            "relative flex h-14 w-full rounded-2xl border-2 border-slate-900 bg-slate-800 px-6 py-2 text-lg font-bold text-white shadow-inner transition-all placeholder:text-slate-500 focus-visible:border-cyan-400 focus-visible:ring-4 focus-visible:ring-cyan-400/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-900 dark:text-white",
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
