import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./messageApi";

export const sendMessage = createAsyncThunk(
  "messages/send",
  async ( {userId, message} ) => {
    const res = await api.sendMessageApi({userId, message});
    return res.data;
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/get",
  async (id) => {
    const res = await api.getMessagesApi(id);
    return res.data;
  }
);




export const deleteChat = createAsyncThunk(
  "messages/deleteChat",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.deleteChatApi(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchAllConversations = createAsyncThunk(
  "messages/fetchAllConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getAllConversationsApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);