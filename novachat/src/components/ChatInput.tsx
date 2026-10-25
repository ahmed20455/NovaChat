import { useState, useRef, useEffect } from "react"
import { SendHorizontal, Square} from "lucide-react"
import { useChatStore } from "../store/chatStore"
import { cn } from "../lib/utils"

const BACKEND_URL = "http://localhost:8000/chat"

const MODELS = [
  { id: "openai/gpt-oss-20b", name: "GPT-OSS 20B" },
  { id: "qwen/qwen3.8-27b", name: "Qwen 3.8 27B" },
]

export function ChatInput({ chatId }: { chatId: string }) {
  const [input, setInput] = useState("")
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    chats,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    isStreaming,
  } = useChatStore()

  const activeChat = chats.find((c) => c.id === chatId)

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px"
    }
  }, [input])

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setStreaming(false)
    }
  }

  const handleSubmit = async () => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    setInput("")
    addMessage(chatId, { role: "user", content: trimmed })
    addMessage(chatId, { role: "assistant", content: "" })
    setStreaming(true)

    // Prepare history
    const history =
      activeChat?.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })) || []
    history.push({ role: "user", content: trimmed })

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          model: selectedModel,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      if (!reader) throw new Error("No response body")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") break

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices?.[0]?.delta?.content || ""
              if (content) {
                fullContent += content
                updateLastAssistantMessage(chatId, fullContent)
              }
            } catch {
              // ignore incomplete JSON
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        // User stopped generation — do nothing
        return
      }
      console.error(error)
      updateLastAssistantMessage(
        chatId,
        `Error: ${error.message || "Something went wrong"}`
      )
    } finally {
      setStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative space-y-3">
      {/* Model Selector */}
      <div className="flex items-center gap-2">
        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={isStreaming}
          aria-label="Select model"
          className="bg-zinc-900 border border-zinc-700 text-sm rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-violet-500 disabled:opacity-50"
        >
          {MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input Box */}
      <div className="flex items-end gap-3 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message Nova..."
          rows={1}
          disabled={isStreaming}
          className="flex-1 bg-transparent resize-none outline-none text-[15px] placeholder:text-zinc-500 max-h-[200px] disabled:opacity-50"
        />

        {isStreaming ? (
          <button
            onClick={stopGeneration}
            aria-label="Stop generating"
            className="p-2 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all"
          >
            <Square size={18} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            aria-label="Send message"
            className={cn(
              "p-2 rounded-xl transition-all flex items-center justify-center",
              input.trim()
                ? "bg-violet-600 hover:bg-violet-500 text-white"
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
          >
            <SendHorizontal size={18} />
          </button>
        )}
      </div>

      <p className="border-t border-zinc-800 bg-zinc-950/80 backdrop-blur text-center">
        Powered by Groq via FastAPI • Secure Backend
      </p>
    </div>
  )
}