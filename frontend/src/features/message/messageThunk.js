import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./messageApi";
import { toast } from "sonner";

export const sendMessage = createAsyncThunk(
  "messages/send",
  async ({ userId, message }, { rejectWithValue }) => {
    try {
      const res = await api.sendMessageApi({ userId, message });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "messages/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.getMessagesApi(id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const sendGroupMessage = createAsyncThunk(
  "messages/sendGroup",
  async ({ groupId, message }, { rejectWithValue }) => {
    try {
      const res = await api.sendGroupMessageApi(groupId, message);
      return { groupId, message: res.data.message };
    } catch (error) {
      toast.error("Failed to send message");
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchGroupMessages = createAsyncThunk(
  "messages/getGroup",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.getGroupMessagesApi(groupId);
      return { groupId, messages: res.data.messages };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
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