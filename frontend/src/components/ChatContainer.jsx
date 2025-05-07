import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import { formatMessageTime } from '../utils/dataUtils';
import {axiosInstance }from '../lib/axios.js'; 

const ChatContainer = () => {
    const queryClient = useQueryClient();
    const authUser = queryClient.getQueryData(["authUser"]);
    const { messages, getMessages, isMessagesLoading, selectedUser } = useChatStore();
    const messageEndRef = useRef(null);

    
    const markMessagesAsRead = async () => {
        try {
            if (selectedUser?._id) {
                await axiosInstance.put(`/messages/mark-as-read/${selectedUser._id}`);
                queryClient.invalidateQueries(["unreadMessageCount"]); 
            }
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
        }
    };

    
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            markMessagesAsRead(); 
        }
    }, [selectedUser._id, getMessages]);

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
                        ref={messageEndRef}
                    >
                        <div className="chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img
                                    src={
                                        message.senderId === authUser._id
                                            ? authUser.profilePicture || "/avatar.png"
                                            : selectedUser.profilePicture || "/avatar.png"
                                    }
                                    alt="profile pic"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
