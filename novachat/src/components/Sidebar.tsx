import { Plus, MessageSquare, Trash2 } from "lucide-react"
import { useChatStore } from "../store/chatStore"
import { cn } from "../lib/utils"

export function Sidebar() {
  const { chats, activeChatId, createNewChat, setActiveChat, deleteChat } =
    useChatStore()

  return (
    <aside className="w-72 border-r border-zinc-800 bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <button
          onClick={() => createNewChat()}
          aria-label="Create new chat"
          className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors text-sm font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm",
              activeChatId === chat.id
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
            )}
          >
            <MessageSquare size={16} className="shrink-0 opacity-70" />
            <span className="truncate flex-1">{chat.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                deleteChat(chat.id)
              }}
              aria-label="Delete chat"
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-400">
            Nova 
      </div>
    </aside>
  )
}