import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Send } from "lucide-react";
import { sendGroupMessage, fetchGroupMessages } from "@/features/message/messageThunk";
import { addSocketMessage } from "@/features/message/messageSlice";
import { getSocket } from "@/services/socket";

const GroupChat = ({ groupId }) => {
  const dispatch = useDispatch();
  const { chats, loading } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.auth);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const messages = chats[groupId] || [];

  useEffect(() => {
    if (groupId) {
      dispatch(fetchGroupMessages(groupId));
      
      const socket = getSocket();
      if (socket) {
        socket.emit("joinGroup", groupId);

        const handleGroupMessage = (data) => {
          if (data.message.receiverId === groupId) {
            dispatch(addSocketMessage({ message: data.message }));
          }
        };

        socket.on("groupMessage", handleGroupMessage);
        
        return () => {
          socket.off("groupMessage", handleGroupMessage);
          socket.emit("leaveGroup", groupId);
        };
      }
    }
  }, [groupId, dispatch]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageText = text.trim();
    setText("");

    try {
      await dispatch(sendGroupMessage({ groupId, message: messageText })).unwrap();
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(messageText);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
      >
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Be the first to send a message!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, index) => {
              const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id;
              const showAvatar =
                index === 0 ||
                (messages[index - 1]?.senderId?._id || messages[index - 1]?.senderId) !== 
                (msg.senderId?._id || msg.senderId);

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-2 ${isOwn ? "flex-row-reverse" : ""}`}
                >
                  {showAvatar && !isOwn ? (
                    <img
                      src={msg.senderId?.profilePicture || "/avatar.png"}
                      alt={msg.senderId?.username || "User"}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    !isOwn && <div className="w-8 flex-shrink-0"></div>
                  )}

                  <div
                    className={`flex flex-col max-w-[70%] ${
                      isOwn ? "items-end" : "items-start"
                    }`}
                  >
                    {showAvatar && !isOwn && (
                      <span className="text-xs font-medium text-gray-600 mb-1 px-3">
                        {msg.senderId?.username || "User"}
                      </span>
                    )}

                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-tr-sm"
                          : "bg-white text-gray-800 shadow-sm rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm break-words whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>

                    <span
                      className={`text-xs text-gray-500 mt-1 px-3 ${
                        isOwn ? "text-right" : ""
                      }`}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-white p-4">
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-full px-4 py-3 outline-none transition-colors"
            placeholder="Type a message..."
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!text.trim()}
            className={`p-3 rounded-full transition-all ${
              text.trim()
                ? "bg-blue-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

GroupChat.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default GroupChat;