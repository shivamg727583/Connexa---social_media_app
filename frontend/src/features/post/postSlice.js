import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllPosts,
  createPost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  fetchPostById,
} from "./postThunks";

const initialState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

// 🔹 helper → posts + selectedPost sync
const updatePost = (state, postId, cb) => {
  const post = state.posts.find(p => p._id === postId);
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
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload.post;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload.post);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          p => p._id !== action.payload.postId
        );
        if (state.selectedPost?._id === action.payload.postId) {
          state.selectedPost = null;
        }
      })
       .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(likePost.fulfilled, (state, action) => {
        updatePost(state, action.payload.postId, (post) => {
          post.likes = action.payload.likes;
        });
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        updatePost(state, action.payload.postId, (post) => {
          post.likes = action.payload.likes;
        });
      })

      .addCase(addComment.fulfilled, (state, action) => {
        updatePost(state, action.payload.postId, (post) => {
          post.comments.push(action.payload.comment);
        });
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        updatePost(state, action.payload.postId, (post) => {
          post.comments = post.comments.filter(
            c => c._id !== action.payload.commentId
          );
        });
      });
  },
});

export const { clearPosts, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
