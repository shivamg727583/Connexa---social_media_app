import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./friendApi";
import { toast } from "sonner";

export const sendFriendRequest = createAsyncThunk(
  "friends/send",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.sendRequestApi(data);
      toast.success("Friend request sent");
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);


export const acceptFriendRequest = createAsyncThunk(
  "friends/accept",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.acceptRequestApi(data);
      toast.success("Friend request accepted");
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);


export const rejectFriendRequest = createAsyncThunk(
  "friends/reject",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.rejectRequestApi(data);
      toast.success("Friend request rejected");
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);



export const fetchIncomingRequests = createAsyncThunk(
  "friends/incoming",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getIncomingRequestsApi();
      return res.data.requests;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const fetchSentRequests = createAsyncThunk(
  "friends/sent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getSentRequestsApi();
      return res.data.requests;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const fetchFriends = createAsyncThunk(
  "friends/list",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getFriendsApi(userId);
      
      return res.data.friends;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);


export const cancelFriendRequest = createAsyncThunk(
  "friends/cancel",
  async (data, { rejectWithValue }) => {
    try {
      await api.cancelRequestApi(data);
      toast.success("Request cancelled");
      return data.to;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);


export const fetchMutualFriends = createAsyncThunk(
  "friends/mutualFriends",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await api.getMutualFriendsApi(userId);
      return { userId, data: res.data };
    } catch {
      return rejectWithValue("Failed to fetch mutual friends");
    }
  }
);

