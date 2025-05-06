import React from 'react'
import { useChatStore } from "../store/useChatStore";
import ChatSidebar from '../components/ChatSidebar';
import ChatContainer from '../components/ChatContainer';
import NoChatSelected from '../components/NoChatSelected';

const MessagePage = () => {
    const { selectedUser } = useChatStore();
  return (
    <div className="flex items-center justify-center pt-6 px-4">
        <div className="bg-white text-black rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <ChatSidebar />

            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
  )
}

export default MessagePage
