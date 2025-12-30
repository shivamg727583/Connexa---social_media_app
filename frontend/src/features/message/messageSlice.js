import { createSlice } from "@reduxjs/toolkit";
import { sendMessage, fetchMessages, deleteChat, fetchAllConversations } from "./messageThunk";

const initialState = {
  chats: {},
  conversationId: null,
  activeChat: null,
  onlineUsers: [],
  typingUsers: {},
  unreadCounts: {},
  lastMessages: {},
  conversations: [],
  loading: false,
  error: null,
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveChat(state, action) {
      state.activeChat = action.payload;
      if (action.payload) {
        state.unreadCounts[action.payload] = 0;
      }
    },

    setOnlineUsers(state, action) {
      state.onlineUsers = action.payload;
    },

    setTyping(state, action) {
      const { userId, isTyping } = action.payload;
      state.typingUsers[userId] = isTyping;
    },

    optimisticMessage(state, action) {
      const { userId, message } = action.payload;
      if (!state.chats[userId]) state.chats[userId] = [];
      state.chats[userId].push(message);
      
      state.lastMessages[userId] = {
        message: message.message,
        timestamp: message.createdAt,
        senderId: message.senderId,
      };
    },

    addSocketMessage(state, action) {
      const { message } = action.payload;
      const otherUserId = message.senderId;

      if (!state.chats[otherUserId]) {
        state.chats[otherUserId] = [];
      }

      const exists = state.chats[otherUserId].some(
        (m) => m._id === message._id
      );

      if (!exists) {
        state.chats[otherUserId].push(message);
        
        state.lastMessages[otherUserId] = {
          message: message.message,
          timestamp: message.createdAt,
          senderId: message.senderId,
        };

        if (state.activeChat !== otherUserId) {
          state.unreadCounts[otherUserId] = (state.unreadCounts[otherUserId] || 0) + 1;
        }
      }
    },

    markMessagesAsRead(state, action) {
      const { conversationId } = action.payload;
      Object.keys(state.chats).forEach((userId) => {
        state.chats[userId] = state.chats[userId].map((msg) => {
          if (msg.conversationId === conversationId && !msg.seen) {
            return { ...msg, seen: true };
          }
          return msg;
        });
      });
      
      if (state.activeChat && state.chats[state.activeChat]) {
         const activeChatMessages = state.chats[state.activeChat];
         if(activeChatMessages.length > 0 && activeChatMessages[0].conversationId === conversationId){
             state.unreadCounts[state.activeChat] = 0;
         }
      }
    },

    updateMessageStatus(state, action) {
      const { userId, messageId, seen } = action.payload;
      if (state.chats[userId]) {
        const msg = state.chats[userId].find((m) => m._id === messageId);
        if (msg) {
          msg.seen = seen;
        }
      }
    },

    setUnreadCount(state, action) {
      const { userId, count } = action.payload;
      state.unreadCounts[userId] = count;
    },

    clearChatMessages(state, action) {
      const { userId } = action.payload;
      delete state.chats[userId];
      delete state.lastMessages[userId];
      delete state.unreadCounts[userId];
    },

    clearMessages() {
      return initialState;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg;
        state.chats[userId] = action.payload.messages;
        state.conversationId = action.payload.conversationId;
        state.unreadCounts[userId] = 0;
        
        const messages = action.payload.messages;
        if (messages.length > 0) {
          const lastMsg = messages[messages.length - 1];
          state.lastMessages[userId] = {
            message: lastMsg.message,
            timestamp: lastMsg.createdAt,
            senderId: lastMsg.senderId,
          };
        }
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations || [];
        
        action.payload.conversations?.forEach(conv => {
          const userId = conv.userId;
          state.unreadCounts[userId] = conv.unreadCount || 0;
          
          if (conv.lastMessage) {
            state.lastMessages[userId] = {
              message: conv.lastMessage.message,
              timestamp: conv.lastMessage.createdAt,
              senderId: conv.lastMessage.senderId,
            };
          }
        });
      })
      .addCase(fetchAllConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.fulfilled, () => {})
      
      .addCase(deleteChat.fulfilled, (state, action) => {
        const userId = action.meta.arg;
        delete state.chats[userId];
        delete state.lastMessages[userId];
        delete state.unreadCounts[userId];
        if (state.activeChat === userId) {
          state.activeChat = null;
        }
      });
  },
});

export const {
  setActiveChat,
  addSocketMessage,
  optimisticMessage,
  clearMessages,
  setOnlineUsers,
  setTyping,
  markMessagesAsRead,
  updateMessageStatus,
  setUnreadCount,
  clearChatMessages,
} = messageSlice.actions;

export default messageSlice.reducer;