import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Message } from "../store/chatStore"
import { cn } from "../lib/utils"
import { Bot, User } from "lucide-react"

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center shrink-0 mt-1">
          <Bot size={16} className="text-violet-400" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
          isUser
            ? "bg-violet-600 text-white"
            : "bg-zinc-900 border border-zinc-800 text-zinc-200"
        )}
      >
        {message.content ? (
          <div
            className={cn(
              "prose prose-sm max-w-none",
              isUser
                ? "prose-invert prose-p:text-white prose-strong:text-white prose-code:text-white"
                : "prose-invert prose-p:text-zinc-200 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800"
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" />
          </span>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 mt-1">
          <User size={16} className="text-zinc-300" />
        </div>
      )}
    </div>
  )
}