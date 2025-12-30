import { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Trash2,
  Loader2,
} from "lucide-react";
import PropTypes from "prop-types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  fetchMessages,
  sendMessage,
  deleteChat,
} from "@/features/message/messageThunk";
import {
  optimisticMessage,
  setActiveChat,
} from "@/features/message/messageSlice";
import { fetchProfileById } from "@/features/auth/authThunks";

import { getSocket } from "@/services/socket";
import { formatTime } from "@/lib/formatTime";

const Messages = ({ selectedUser, onBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: routeUserId } = useParams();

  const { user, userProfile } = useSelector((state) => state.auth);
  const { chats, onlineUsers, typingUsers } = useSelector(
    (state) => state.message
  );

  const chatUser = selectedUser || userProfile;
  const chatUserId = selectedUser?._id || routeUserId;

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const messages = useMemo(
    () => chats[chatUserId] || [],
    [chats, chatUserId]
  );

  const isOnline = onlineUsers.includes(chatUserId);
  const isTyping = typingUsers[chatUserId];

  useEffect(() => {
    if (!selectedUser && routeUserId) {
      dispatch(fetchProfileById(routeUserId));
    }
  }, [selectedUser, routeUserId, dispatch]);

  useEffect(() => {
    if (chatUserId) {
      dispatch(setActiveChat(chatUserId));
      dispatch(fetchMessages(chatUserId));
    }
  }, [chatUserId, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (!socket || !chatUserId) return;

    socket.emit("typing", {
      receiverId: chatUserId,
      isTyping,
    });
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    emitTyping(true);
    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    const text = message.trim();
    setMessage("");
    setIsSending(true);
    emitTyping(false);

    const tempMessage = {
      _id: `temp-${Date.now()}`,
      senderId: user._id,
      receiverId: chatUserId,
      message: text,
      createdAt: new Date().toISOString(),
    };

    dispatch(
      optimisticMessage({
        userId: chatUserId,
        message: tempMessage,
      })
    );

    try {
      await dispatch(sendMessage({ userId: chatUserId, message: text }));
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async () => {
    if (!window.confirm("Delete this conversation?")) return;

    await dispatch(deleteChat(chatUserId));
    dispatch(setActiveChat(null));
    onBack?.();
  };

  const goToProfile = () => {
    navigate(`/profile/${chatUserId}`);
  };

  if (!chatUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="md:hidden"
          >
            <ArrowLeft />
          </Button>

          <div
            onClick={goToProfile}
            className="flex items-center gap-3 cursor-pointer"
          >
            <Avatar>
              <AvatarImage src={chatUser.profilePicture} />
              <AvatarFallback>
                {chatUser.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-semibold">{chatUser.username}</p>
              <p
                className={`text-xs ${
                  isOnline || isTyping
                    ? "text-green-500 font-medium"
                    : "text-gray-500"
                }`}
              >
                {isTyping ? "typing..." : isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDeleteChat}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((msg) => {
            const isMine = msg.senderId === user._id;

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[70%] ${
                    isMine
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-800"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="text-xs mt-1 text-right opacity-70">
                    {isMine && formatTime(msg.createdAt)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 px-4 py-3 border-t"
      >
        <Input
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={isSending}
        />
        <Button type="submit" disabled={!message.trim() || isSending}>
          {isSending ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </form>
    </div>
  );
};

Messages.propTypes = {
  selectedUser: PropTypes.object,
  onBack: PropTypes.func,
};

export default Messages;
