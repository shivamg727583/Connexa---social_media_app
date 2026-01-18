import { createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./groupApi";
import { toast } from "sonner";

export const fetchMyGroups = createAsyncThunk(
  "groups/fetchMyGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getMyGroupsApi();
      return res.data.groups;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch groups" });
    }
  }
);

export const fetchAllGroups = createAsyncThunk(
  "groups/fetchAllGroups",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getAllGroupsApi();
      return res.data.groups;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch groups" });
    }
  }
);

export const fetchGroupById = createAsyncThunk(
  "groups/fetchGroupById",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.getGroupByIdApi(groupId);
      return res.data.group;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch group" });
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.createGroupApi(formData);
      toast.success("Group created successfully!");
      return res.data.group;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create group";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const joinGroup = createAsyncThunk(
  "groups/join",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.joinGroupApi(groupId);
      toast.success(res.data.message || "Join request sent successfully");
      return { groupId, ...res.data };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to join group";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const cancelJoinRequest = createAsyncThunk(
  "groups/cancelRequest",
  async (groupId, { rejectWithValue }) => {
    try {
      const res = await api.cancelJoinRequestApi(groupId);
      toast.success("Request cancelled");
      return groupId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cancel request";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const approveGroupMember = createAsyncThunk(
  "groups/approveMember",
  async ({ groupId, memberId, reject = false }, { rejectWithValue }) => {
    try {
      await api.approveGroupMemberApi({ groupId, memberId, reject });
      toast.success(reject ? "Request rejected" : "Member approved");
      return { groupId, memberId, reject };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to process request";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const removeMember = createAsyncThunk(
  "groups/removeMember",
  async ({ groupId, memberId }, { rejectWithValue }) => {
    try {
      await api.removeMemberApi({ groupId, memberId });
      toast.success("Member removed");
      return { groupId, memberId };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove member";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateGroupCover = createAsyncThunk(
  "groups/updateCover",
  async ({ groupId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.updateGroupCoverApi(groupId, formData);
      toast.success("Cover updated successfully");
      return { groupId, coverImage: res.data.coverImage };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update cover";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const updateGroupAvatar = createAsyncThunk(
  "groups/updateAvatar",
  async ({ groupId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.updateGroupAvatarApi(groupId, formData);
      toast.success("Avatar updated successfully");
      return { groupId, avatar: res.data.avatar };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update avatar";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);