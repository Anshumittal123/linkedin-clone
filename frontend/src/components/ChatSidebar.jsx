import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';

const ChatSidebar = () => {
    const {getUsers, users, selectedUser, setSelectedUser, isUsersLoading} = useChatStore();

    console.log("User data:- ",users);
    
    useEffect(()=>{
        getUsers();
    }, [getUsers])

    if(isUsersLoading) return <SidebarSkeleton />

    
  return (
    <aside className="h-full w-30 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
         <div className="border-b border-base-300 w-full p-5">
         <div className="flex items-center gap-2">
         <Users className="size-6" />
          <span className="font-medium hidden text-black lg:block">Contacts</span>
         </div>

        <div className="overflow-y-auto w-full py-3">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 
              hover:text-white transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePicture || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 ">
              <div className="font-medium truncate text-gray-700 ">{user.name}</div>
            </div>
          </button>
        ))}

        </div>    
        </div>
    </aside>
  )
}

export default ChatSidebar
