import ChatHeader from "./components/chat-header"
import MessageBar from "./components/messages-bar"
import MessageContainer from "./components/messages-container"

const ChatContainer = () => {
  return (
    <div className="fixed top-0 flex flex-col h-[100vh] w-[100vw] bg-[#1c1b25] md:static md:flex-1">
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </div>
  )
}

export default ChatContainer