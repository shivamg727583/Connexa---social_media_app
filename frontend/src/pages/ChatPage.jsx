import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MessageCircle, Search, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Messages from "./MessagePage";
import GroupChat from "@/components/group/GroupChat";
import { setActiveChat } from "@/features/message/messageSlice";
import { formatTime } from "@/lib/formatTime";
import { fetchAllConversations } from "@/features/message/messageThunk";
import { fetchMyGroups } from "@/features/group/groupThunks";

const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    activeChat,
    onlineUsers,
    lastMessages,
    conversations,
    typingUsers,
    chats
  } = useSelector((state) => state.message);
  const { myGroups } = useSelector((state) => state.group);

  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatType, setActiveChatType] = useState(null);

  const allConversations = useMemo(() => {
    const userConvos = conversations.map((c) => ({
      ...c,
      type: "user",
      id: c.userId,
      name: c.user?.username,
      picture: c.user?.profilePicture,
      lastMessage: lastMessages[c.userId],
    }));

    const groupConvos = myGroups.map((g) => {
      const groupChats = chats[g._id] || [];
      const lastMsg = groupChats[groupChats.length - 1];
      return {
        type: "group",
        id: g._id,
        name: g.name,
        picture: g.avatar,
        group: g,
        lastMessage: lastMsg ? {
          message: lastMsg.message,
          timestamp: lastMsg.createdAt,
          senderId: lastMsg.senderId?._id || lastMsg.senderId,
        } : null,
      };
    });

    return [...userConvos, ...groupConvos].sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || 0;
      const timeB = b.lastMessage?.timestamp || 0;
      return new Date(timeB) - new Date(timeA);
    });
  }, [conversations, myGroups, lastMessages, chats]);

  const filteredConversations = useMemo(() => {
    return allConversations.filter((c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allConversations, searchQuery]);

  const selectedConversation = allConversations.find(
    (c) => c.id === activeChat
  );

  useEffect(() => {
    return () => {
      dispatch(setActiveChat(null));
      setActiveChatType(null);
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllConversations());
    dispatch(fetchMyGroups());
  }, [dispatch]);

  const openChat = (id, type) => {
    dispatch(setActiveChat(id));
    setActiveChatType(type);
    setShowChat(true);
  };

  const goBack = () => {
    setShowChat(false);
    dispatch(setActiveChat(null));
    setActiveChatType(null);
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
            const isGroup = conv.type === "group";
            const isOnline = !isGroup && onlineUsers.includes(conv.id);
            const lastMsg = conv.lastMessage;
            const isMyMessage = lastMsg?.senderId === user?._id;
            const isTyping = !isGroup && typingUsers[conv.id];

            return (
              <motion.div
                key={conv.id}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                onClick={() => openChat(conv.id, conv.type)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${activeChat === conv.id
                  ? "bg-blue-50 dark:bg-blue-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-900"
                  }`}
              >
                <div className="relative flex-shrink-0">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={conv.picture} />
                    <AvatarFallback>
                      {isGroup ? <Users className="w-6 h-6" /> : conv.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  {!isGroup && isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-950" />
                  )}

                  {isGroup && (
                    <span className="absolute bottom-0 right-0 w-5 h-5 bg-purple-500 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center">
                      <Users className="w-3 h-3 text-white" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm truncate">
                      {conv.name}
                    </p>

                    {lastMsg && (
                      <span className="text-xs text-gray-500">
                        {formatTime(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate 
                         ${isTyping ? "text-green-500 font-medium" : ""}`}
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
          activeChatType === "group" ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 px-4 py-3 border-b">
                <button
                  onClick={goBack}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                >
                  ←
                </button>
                <Avatar>
                  <AvatarImage src={selectedConversation.picture} />
                  <AvatarFallback>
                    <Users className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedConversation.name}</p>
                  <p className="text-xs text-gray-500">Group Chat</p>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <GroupChat groupId={selectedConversation.id} />
              </div>
            </div>
          ) : (
            <Messages
              selectedUser={selectedConversation.user}
              onBack={goBack}
            />
          )
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