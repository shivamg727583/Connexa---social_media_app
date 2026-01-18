import { createSlice } from "@reduxjs/toolkit";
import {
  sendMessage,
  fetchMessages,
  deleteChat,
  fetchAllConversations,
  fetchGroupMessages,
} from "./messageThunk";

const initialState = {
  chats: {},              
  conversationId: null,
  activeChat: null,      
  onlineUsers: [],
  typingUsers: {},
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

      if (!state.chats[userId]) {
        state.chats[userId] = [];
      }

      state.chats[userId].push(message);

      state.lastMessages[userId] = {
        message: message.message,
        timestamp: message.createdAt,
        senderId: message.senderId,
      };
    },

    addConversation: (state, action) => {
      const exists = state.conversations.some(
        c => c.userId === action.payload.userId
      );

      if (!exists) {
        state.conversations.unshift(action.payload);
      }
    },

    addSocketMessage(state, action) {
      const { message } = action.payload;

      const chatId = message.receiverType === "GROUP" 
        ? message.receiverId 
        : message.senderId;

      if (!state.chats[chatId]) {
        state.chats[chatId] = [];
      }

      const exists = state.chats[chatId].some(
        (m) => m._id === message._id
      );

      if (!exists) {
        state.chats[chatId].push(message);
      }
    },

    clearChatMessages(state, action) {
      const { userId } = action.payload;
      delete state.chats[userId];
      delete state.lastMessages[userId];

      if (state.activeChat === userId) {
        state.activeChat = null;
      }
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
        const { messages, conversationId } = action.payload;

        state.chats[userId] = messages || [];
        state.conversationId = conversationId;

        if (messages?.length) {
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

      .addCase(fetchGroupMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, messages } = action.payload;
        state.chats[groupId] = messages || [];
      })
      .addCase(fetchGroupMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations || [];

        action.payload.conversations?.forEach((conv) => {
          const userId = conv.userId;

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
  clearChatMessages,
  addConversation
} = messageSlice.actions;

export default messageSlice.reducer;