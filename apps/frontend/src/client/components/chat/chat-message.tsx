"use client"

import * as React from "react"
import { Shield, Star } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { cn } from "@/client/utils/utils"
import { Message } from "@/client/types/chat"

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "group flex w-full items-start gap-3 px-2 py-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-14 shrink-0 select-none items-center justify-center rounded-xl border-3 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] transition-transform hover:-rotate-6",
          isUser
            ? "bg-secondary text-white"
            : "bg-primary text-black"
        )}
      >
        {isUser ? (
          <Shield className="size-7 drop-shadow-sm" strokeWidth={3} />
        ) : (
          <Star className="size-7 drop-shadow-sm fill-white text-black" strokeWidth={3} />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          "relative flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div className={cn("mb-1 flex items-center gap-2 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
            <span className={cn(
                "text-sm font-lilita uppercase tracking-wide brawl-text-outline",
                isUser ? "text-secondary-foreground" : "text-primary"
            )}>
                {isUser ? "You" : "Brawler Bot"}
            </span>
        </div>
        <div
          className={cn(
            "rounded-2xl border-3 border-black px-5 py-3 shadow-[0_6px_0_0_rgba(0,0,0,1)] text-lg font-bold leading-snug transform transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,1)]",
            isUser
              ? "bg-secondary text-white"
              : "bg-white text-black"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap font-nunito">{message.content}</div>
          ) : (
            <div className="font-nunito">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc last:mb-0">{children}</ul>,
                  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal last:mb-0">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  h1: ({ children }) => <h1 className="mb-2 text-2xl font-bold last:mb-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="mb-2 text-xl font-bold last:mb-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="mb-2 text-lg font-bold last:mb-0">{children}</h3>,
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-black">{children}</code>
                    ) : (
                      <code className="block rounded bg-gray-200 p-2 text-sm font-mono text-black overflow-x-auto">{children}</code>
                    );
                  },
                  pre: ({ children }) => <pre className="mb-2 rounded bg-gray-200 p-2 overflow-x-auto last:mb-0">{children}</pre>,
                  blockquote: ({ children }) => <blockquote className="mb-2 border-l-4 border-gray-400 pl-4 italic last:mb-0">{children}</blockquote>,
                  a: ({ children, href }) => <a href={href} className="text-blue-600 underline hover:text-blue-800" target="_blank" rel="noopener noreferrer">{children}</a>,
                  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                  em: ({ children }) => <em className="italic">{children}</em>,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
