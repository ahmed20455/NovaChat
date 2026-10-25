import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

type ChatState = {
  chats: Chat[]
  activeChatId: string | null
  isStreaming: boolean

  createNewChat: () => string
  setActiveChat: (id: string) => void
  addMessage: (chatId: string, message: Omit<Message, "id" | "createdAt">) => void
  updateLastAssistantMessage: (chatId: string, content: string) => void
  deleteChat: (id: string) => void
  setStreaming: (value: boolean) => void
}

const generateId = () => crypto.randomUUID()

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      isStreaming: false,

      createNewChat: () => {
        const id = generateId()
        const newChat: Chat = {
          id,
          title: "New Chat",
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set((state) => ({
          chats: [newChat, ...state.chats],
          activeChatId: id,
        }))
        return id
      },

      setActiveChat: (id) => set({ activeChatId: id }),

      addMessage: (chatId, message) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat

            const newMessage: Message = {
              ...message,
              id: generateId(),
              createdAt: Date.now(),
            }

            // Auto-generate title from first user message
            const title =
              chat.messages.length === 0 && message.role === "user"
                ? message.content.slice(0, 40) + (message.content.length > 40 ? "..." : "")
                : chat.title

            return {
              ...chat,
              title,
              messages: [...chat.messages, newMessage],
              updatedAt: Date.now(),
            }
          }),
        }))
      },

      updateLastAssistantMessage: (chatId, content) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat
            const messages = [...chat.messages]
            const last = messages[messages.length - 1]
            if (last && last.role === "assistant") {
              messages[messages.length - 1] = { ...last, content }
            }
            return { ...chat, messages, updatedAt: Date.now() }
          }),
        }))
      },

      deleteChat: (id) => {
        set((state) => {
          const newChats = state.chats.filter((c) => c.id !== id)
          const newActive =
            state.activeChatId === id
              ? newChats[0]?.id ?? null
              : state.activeChatId
          return { chats: newChats, activeChatId: newActive }
        })
      },

      setStreaming: (value) => set({ isStreaming: value }),
    }),
    {
      name: "nova-chat-storage",
    }
  )
)