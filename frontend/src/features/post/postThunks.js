import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPostsApi,
  createPostApi,
  deletePostApi,
  toggleLikePostApi,
  toggleSavePostApi,
  addCommentApi,
  getCommentsApi,
  deleteCommentApi,
  getUserPostsApi,
  getMyPostsApi,
  getPostByIdApi,
} from "./postApi";
import { toast } from "sonner";

export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllPostsApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch posts" });
    }
  }
);

export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyPostsApi();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch posts" });
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await getPostByIdApi(postId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch post" });
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getUserPostsApi(userId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch posts" });
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/create",
  async (postData, { rejectWithValue }) => {
    try {
      const res = await createPostApi(postData);
      toast.success("Post created successfully");
      return res.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create post";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/delete",
  async (postId, { rejectWithValue }) => {
    try {
       await deletePostApi(postId);
      toast.success("Post deleted successfully");
      return postId;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete post";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  "posts/toggleLike",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await toggleLikePostApi(postId);
      return res.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to like post" });
    }
  }
);

export const toggleSavePost = createAsyncThunk(
  "posts/toggleSave",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await toggleSavePostApi(postId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to save post" });
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await addCommentApi(postId, { text });
      return { postId, comment: res.data.comment };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add comment";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);

export const getComments = createAsyncThunk(
  "posts/getComments",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await getCommentsApi(postId);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch comments" });
    }
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await deleteCommentApi(commentId);
      toast.success("Comment deleted successfully");
      return { postId, commentId };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete comment";
      toast.error(message);
      return rejectWithValue(error.response?.data || { message });
    }
  }
);