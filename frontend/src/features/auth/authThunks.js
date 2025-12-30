import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./authApi";
import { toast } from 'sonner';

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.registerApi(data);
      toast.success("Register successfull")
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message)
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.loginApi(data);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successfull")
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message)
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getProfileApi();
      console.log("fetch profile thunk",res.data);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const fetchProfileById = createAsyncThunk(
  "auth/profileById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.getProfileByIdApi(id);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const editProfile = createAsyncThunk(
  "auth/editProfile",
  async (data, { rejectWithValue }) => {
    try {
      const res = await api.editProfileApi(data);
      toast.success("Profile updated successfully");
      return res.data;
    } catch (e) {
      toast.error(e.response.data.message);
      return rejectWithValue(e.response.data.message);
    }
  }
);

export const getSuggestedUsers = createAsyncThunk(
  "auth/suggested",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.suggestedUsersApi();
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response.data.message);
    }
  }
);
