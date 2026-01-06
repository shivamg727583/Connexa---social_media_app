import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  createPost,
  deletePost,
  toggleLikePost,
  addComment,
  deleteComment,
  fetchPostById,
  toggleSavePost,
  fetchMyPosts,
  fetchUserPosts,
} from "./postThunks";

const initialState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

/**
 * Helper function to update a post in both posts array and selectedPost
 */
const updatePost = (state, postId, cb) => {
  const post = state.posts.find((p) => p._id === postId);
  if (post) cb(post);

  if (state.selectedPost?._id === postId) {
    cb(state.selectedPost);
  }
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: () => initialState,
    clearSelectedPost: (state) => {
      state.selectedPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts.map((post) => ({
          ...post,
          isSaved: post.isSaved ?? false,
        }));
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts.map((post) => ({
          ...post,
          isSaved: post.isSaved ?? false,
        }));
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts.map((post) => ({
          ...post,
          isSaved: post.isSaved ?? false,
        }));
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = {
          ...action.payload.post,
          isSaved: action.payload.post.isSaved ?? false,
        };
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift({
          ...action.payload.post,
          isSaved: false,
        });
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (p) => p._id !== action.payload
        );
        if (state.selectedPost?._id === action.payload) {
          state.selectedPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, likes, isLiked } = action.payload;
        
        updatePost(state, postId, (post) => {
          post.likes = likes;
          post.isLiked = isLiked;
        });
      })

      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;
        
        updatePost(state, postId, (post) => {
          post.isSaved = isSaved;
        });
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        
        updatePost(state, postId, (post) => {
          post.comments.push(comment);
        });
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;
        
        updatePost(state, postId, (post) => {
          post.comments = post.comments.filter(
            (c) => c._id !== commentId
          );
        });
      });
  },
});

export const { clearPosts, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;