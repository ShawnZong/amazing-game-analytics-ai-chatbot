import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-black uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 drop-shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-yellow-400 text-slate-900 border-b-4 border-r-2 border-yellow-600 hover:bg-yellow-300 active:border-0 active:mt-1 shadow-lg",
        destructive:
          "bg-red-500 text-white border-b-4 border-r-2 border-red-800 hover:bg-red-400 active:border-0 active:mt-1 shadow-lg",
        outline:
          "bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-100 active:scale-95 shadow-sm",
        secondary:
          "bg-cyan-400 text-white border-b-4 border-r-2 border-cyan-700 hover:bg-cyan-300 active:border-0 active:mt-1 shadow-lg",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800",
        link: "text-primary underline-offset-4 hover:underline",
        emerald: 
          "bg-emerald-500 text-white border-b-4 border-r-2 border-emerald-700 hover:bg-emerald-400 active:border-0 active:mt-1 shadow-lg",
        purple:
          "bg-purple-500 text-white border-b-4 border-r-2 border-purple-800 hover:bg-purple-400 active:border-0 active:mt-1 shadow-lg",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-10 rounded-full px-4 text-xs",
        lg: "h-16 rounded-full px-10 text-lg",
        icon: "h-12 w-12 rounded-xl", // Icon buttons slightly less rounded
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
