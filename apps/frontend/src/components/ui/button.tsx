import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-yellow-400 to-orange-500 text-yellow-950 shadow-[0_4px_0_rgb(180,83,9)] border-2 border-yellow-200 hover:brightness-110 active:mt-1 active:shadow-none active:border-b-2",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-[0_4px_0_rgb(153,27,27)] border-2 border-red-300 hover:brightness-110 active:mt-1 active:shadow-none active:border-b-2",
        outline:
          "border-2 border-slate-300 bg-white text-slate-700 shadow-[0_4px_0_#cbd5e1] hover:bg-slate-50 hover:text-slate-900 active:mt-1 active:shadow-none active:border-b-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:shadow-[0_4px_0_#1e293b]",
        secondary:
          "bg-gradient-to-b from-purple-400 to-purple-600 text-white shadow-[0_4px_0_rgb(107,33,168)] border-2 border-purple-200 hover:brightness-110 active:mt-1 active:shadow-none active:border-b-2",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-primary underline-offset-4 hover:underline",
        emerald: 
          "bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[0_4px_0_rgb(6,95,70)] border-2 border-emerald-200 hover:brightness-110 active:mt-1 active:shadow-none active:border-b-2",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-lg px-3 text-xs shadow-[0_2px_0_rgb(0,0,0,0.2)]",
        lg: "h-14 rounded-xl px-8 text-base shadow-[0_6px_0_rgb(0,0,0,0.2)]",
        icon: "h-11 w-11",
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
