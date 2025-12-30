import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MessageCircle, Search } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Messages from "./MessagePage";
import { setActiveChat } from "@/features/message/messageSlice";
import { formatTime } from "@/lib/formatTime";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    activeChat,
    onlineUsers,
    unreadCounts,
    lastMessages,
    conversations,
    typingUsers
  } = useSelector((state) => state.message);

  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) =>
      c.user?.username
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [conversations, searchQuery]);

  const selectedConversation = conversations.find(
    (c) => c.userId === activeChat
  );

  useEffect(() => {
    return () => {
      dispatch(setActiveChat(null));
    };
  }, [dispatch]);

  const openChat = (userId) => {
    dispatch(setActiveChat(userId));
    setShowChat(true);
  };

  const goBack = () => {
    setShowChat(false);
    dispatch(setActiveChat(null));
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-screen bg-white dark:bg-gray-950">
      <aside
        className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 ${showChat ? "hidden md:flex" : "flex"
          } flex-col`}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-xl mb-4">Messages</h2>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-gray-100 dark:bg-gray-900 border-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 mb-3 opacity-40" />
              <p className="text-sm">
                {searchQuery
                  ? "No conversations found"
                  : "No conversations yet"}
              </p>
            </div>
          )}

          {filteredConversations.map((conv) => {
            const u = conv.user;
            const isOnline = onlineUsers.includes(conv.userId);
            const unreadCount = unreadCounts[conv.userId] || 0;
            const lastMsg = lastMessages[conv.userId];
            const isMyMessage = lastMsg?.senderId === user?._id;
            const isTyping = typingUsers[conv.userId];


            return (
              <motion.div
                key={conv.userId}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                onClick={() => openChat(conv.userId)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeChat === conv.userId
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={u.profilePicture} />
                    <AvatarFallback>{u.username[0]}</AvatarFallback>
                  </Avatar>

                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm truncate">
                      {u.username}
                    </p>

                    {lastMsg && (
                      <span className="text-xs text-gray-500">
                        {formatTime( lastMsg.timestamp  )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${unreadCount > 0
                          ? "text-gray-900 dark:text-white font-medium"
                          : "text-gray-500"
                        } ${ isTyping ? "text-green-500 font-medium":""}`}
                    >
                      {isTyping ? "typing..." : lastMsg ? (
                        <>
                          {isMyMessage && "You: "}
                          {lastMsg.message}
                        </>
                      ) : (
                        <span className="text-gray-400">
                          No messages yet
                        </span>
                      )}
                    </p>

                    {unreadCount > 0 && (
                      <span className="ml-2 min-w-[20px] h-5 px-2 flex items-center justify-center bg-blue-600 text-white text-xs font-bold rounded-full">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </aside>

      <div
        className={`flex-1 flex flex-col ${!showChat ? "hidden md:flex" : "flex"
          }`}
      >
        {selectedConversation ? (
          <Messages
            selectedUser={selectedConversation.user}
            onBack={goBack}
          />
        ) : (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-12 h-12 mb-4 opacity-40" />
            <h3 className="text-xl font-semibold mb-2">
              Your Messages
            </h3>
            <p className="text-sm text-gray-400">
              Select a conversation to start chatting
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
