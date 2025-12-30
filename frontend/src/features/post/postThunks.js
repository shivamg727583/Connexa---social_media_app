import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPostsApi,
  createPostApi,
  deletePostApi,
  likePostApi,
  unlikePostApi,
  addCommentApi,
  getCommentsApi,
  deleteCommentApi,
  getUserPostsApi,
  getMyPostsApi,
  getPostByIdApi,
} from "./postApi";
import { toast } from "sonner";

// Fetch all posts
export const fetchAllPosts = createAsyncThunk("posts/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await getAllPostsApi();
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch my posts
export const fetchMyPosts = createAsyncThunk("posts/fetchMyPosts", async (_, { rejectWithValue }) => {
  try {
    const res = await getMyPostsApi();
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchPostById = createAsyncThunk("posts/fetchPostById", async (postId, { rejectWithValue }) => {
  try {
    const res = await getPostByIdApi(postId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});
// Fetch posts of specific user
export const fetchUserPosts = createAsyncThunk("posts/fetchUserPosts", async (userId, { rejectWithValue }) => {
  try {
    const res = await getUserPostsApi(userId);
    return res.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create new post
export const createPost = createAsyncThunk("posts/create", async (postData, { rejectWithValue }) => {
  try {
    const res = await createPostApi(postData);
    toast.success("Post created successfully");
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return rejectWithValue(error.response.data);
  }
});

// Delete post
export const deletePost = createAsyncThunk("posts/delete", async (postId, { rejectWithValue }) => {
  try {
    const res = await deletePostApi(postId);
    toast.success("Post deleted successfully");
    return { postId, ...res.data };
  } catch (error) {
    toast.error(error.response.data.message);
    return rejectWithValue(error.response.data);
  }
});

// Like post
export const likePost = createAsyncThunk("posts/like", async (postId, { rejectWithValue }) => {
  try {
    const res = await likePostApi(postId);
    return { postId, likes: res.data.likes };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Unlike post
export const unlikePost = createAsyncThunk("posts/unlike", async (postId, { rejectWithValue }) => {
  try {
    const res = await unlikePostApi(postId);
    return { postId, likes: res.data.likes };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Add comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const res = await addCommentApi(postId, { text });
      return { postId, comment: res.data.comment };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Get comments
export const getComments = createAsyncThunk("posts/getComments", async (postId, { rejectWithValue }) => {
  try {
    const res = await getCommentsApi(postId);
    return { postId, comments: res.data.comments };
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete comment
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await deleteCommentApi(commentId);
      return { postId, commentId }; 
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

