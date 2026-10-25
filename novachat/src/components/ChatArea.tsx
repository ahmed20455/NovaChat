import { useEffect, useRef } from "react"
import { useChatStore } from "../store/chatStore"
import { ChatInput } from "./ChatInput"
import { MessageBubble } from "./MessageBubble"
import { Sparkles } from "lucide-react"

export function ChatArea() {
  const { chats, activeChatId, isStreaming } = useChatStore()
  const activeChat = chats.find((c) => c.id === activeChatId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeChat?.messages, isStreaming])

  if (!activeChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Select or create a chat
      </div>
    )
  }

  const isEmpty = activeChat.messages.length === 0

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto.flex-1">
        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
              <Sparkles className="text-violet-400" size={28} />
            </div>
            <h1 className="text-2xl font-semibold mb-2">How can I help you today?</h1>
            <p className="text-zinc-500 max-w-md">
              Responses are simulated with a streaming effect.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
            {activeChat.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <ChatInput chatId={activeChat.id} />
        </div>
      </div>
    </div>
  )
}