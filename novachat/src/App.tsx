import { useEffect } from "react"
import { useChatStore } from "./store/chatStore"
import { Sidebar } from "./components/Sidebar"
import { ChatArea } from "./components/ChatArea"

function App() {
  const { chats, activeChatId, createNewChat } = useChatStore()

  // Create first chat if none exists
  useEffect(() => {
    if (chats.length === 0) {
      createNewChat()
    } else if (!activeChatId) {
      useChatStore.getState().setActiveChat(chats[0].id)
    }
  }, [chats.length, activeChatId, createNewChat])

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      <ChatArea />
    </div>
  )
}

export default App