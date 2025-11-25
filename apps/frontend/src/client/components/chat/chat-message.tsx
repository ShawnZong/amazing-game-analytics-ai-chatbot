"use client"

import { Shield, Star } from "lucide-react"
import ReactMarkdown from "react-markdown"
import type { SyntaxHighlighterProps } from "react-syntax-highlighter"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import { Message } from "@/client/types/chat"
import { cn } from "@/client/utils/utils"

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
                {isUser ? "You" : "Amazing AI Bot"}
            </span>
        </div>
        <div
          className={cn(
            "rounded-2xl border-3 border-black px-5 py-3 shadow-[0_6px_0_0_rgba(0,0,0,1)] text-lg leading-snug transform transition-all hover:-translate-y-1 active:translate-y-1 active:shadow-[0_2px_0_0_rgba(0,0,0,1)]",
            isUser
              ? "bg-secondary text-white font-bold"
              : "bg-white text-black"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap font-nunito">{message.content}</div>
          ) : (
            <div className="font-nunito markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || "");
                    const language = match ? match[1] : "";
                    const isInline = !className || !match;
                    const codeString = String(children).replace(/\n$/, "");

                    if (!isInline && language) {
                      return (
                        <div className="mb-2 rounded overflow-hidden last:mb-0">
                          <SyntaxHighlighter
                            language={language}
                            style={oneDark as SyntaxHighlighterProps["style"]}
                            PreTag="div"
                          >
                            {codeString}
                          </SyntaxHighlighter>
                        </div>
                      );
                    }

                    return (
                      <code className="rounded bg-gray-200 px-1.5 py-0.5 text-sm font-mono text-black" {...props}>
                        {children}
                      </code>
                    );
                  },
                  table: ({ children }) => (
                    <div className="mb-2 overflow-x-auto last:mb-0 w-full">
                      <table className="w-full border-collapse border-2 border-black">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                  tbody: ({ children }) => <tbody>{children}</tbody>,
                  tr: ({ children }) => <tr>{children}</tr>,
                  th: ({ children }) => (
                    <th className="border border-black px-4 py-2 text-left font-bold bg-gray-200">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-black px-4 py-2 font-normal">
                      {children}
                    </td>
                  ),
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
