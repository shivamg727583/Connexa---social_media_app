import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle, Search, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { setActiveChat } from "@/features/message/messageSlice";
import { fetchAllConversations } from "@/features/message/messageThunk";
import { fetchMyGroups } from "@/features/group/groupThunks";
import { LoadingSpinner, EmptyState } from "@/components/shared/PageLayout";
import ConversationItem from "@/components/chats/ConversationItem";

const Messages = lazy(() => import("./MessagePage"));
const GroupChat = lazy(() => import("@/components/group/GroupChat"));



const ChatPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { activeChat, onlineUsers, lastMessages, conversations, typingUsers, chats } = useSelector((state) => state.message);
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

  const filteredConversations = useMemo(() => 
    allConversations.filter((c) => c.name?.toLowerCase().includes(searchQuery.toLowerCase())),
    [allConversations, searchQuery]
  );

  const selectedConversation = useMemo(() => 
    allConversations.find((c) => c.id === activeChat),
    [allConversations, activeChat]
  );

  useEffect(() => {
    dispatch(fetchAllConversations());
    dispatch(fetchMyGroups());

    return () => {
      dispatch(setActiveChat(null));
    };
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
      <aside className={`w-full md:w-80 lg:w-96 border-r border-gray-200 dark:border-gray-800 ${showChat ? "hidden md:flex" : "flex"} flex-col`}>
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="font-bold text-xl mb-3 sm:mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-900 border-none text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title={searchQuery ? "No conversations found" : "No conversations yet"}
              description="Start a new conversation"
            />
          ) : (
            filteredConversations.map((conv) => {
              const isGroup = conv.type === "group";
              const isOnline = !isGroup && onlineUsers.includes(conv.id);
              const lastMsg = conv.lastMessage;
              const isMyMessage = lastMsg?.senderId === user?._id;
              const isTyping = !isGroup && typingUsers[conv.id];

              return (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={activeChat === conv.id}
                  isGroup={isGroup}
                  isOnline={isOnline}
                  lastMsg={lastMsg}
                  isMyMessage={isMyMessage}
                  isTyping={isTyping}
                  onClick={() => openChat(conv.id, conv.type)}
                />
              );
            })
          )}
        </div>
      </aside>

      <div className={`flex-1 flex flex-col ${!showChat ? "hidden md:flex" : "flex"}`}>
        {selectedConversation ? (
          <Suspense fallback={<LoadingSpinner />}>
            {activeChatType === "group" ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 px-3 sm:px-4 py-3 border-b">
                  <button onClick={goBack} className="md:hidden p-2 hover:bg-gray-100 rounded-full transition">
                    ←
                  </button>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.picture} />
                    <AvatarFallback><Users className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{selectedConversation.name}</p>
                    <p className="text-xs text-gray-500">Group Chat</p>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <GroupChat groupId={selectedConversation.id} />
                </div>
              </div>
            ) : (
              <Messages selectedUser={selectedConversation.user} onBack={goBack} />
            )}
          </Suspense>
        ) : (
          <EmptyState
            icon={MessageCircle}
            title="Your Messages"
            description="Select a conversation to start chatting"
          />
        )}
      </div>
    </div>
  );
};

export default ChatPage;