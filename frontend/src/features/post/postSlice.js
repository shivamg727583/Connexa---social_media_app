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
  fetchGroupPosts,
} from "./postThunks";

const initialState = {
 
  posts: [],

 
  groupPosts: {}, 
  selectedPost: null,
  loading: false,
  error: null,
};

/* =====================================================
   HELPER: UPDATE POST EVERYWHERE (USER + GROUP + SELECTED)
===================================================== */
const updatePostEverywhere = (state, postId, cb) => {
  // user posts
  const post = state.posts.find((p) => p._id === postId);
  if (post) cb(post);

  // selected post
  if (state.selectedPost?._id === postId) {
    cb(state.selectedPost);
  }

  // group posts
  Object.values(state.groupPosts).forEach((groupArr) => {
    const gp = groupArr.find((p) => p._id === postId);
    if (gp) cb(gp);
  });
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

      /* ===============================
         FETCH GROUP POSTS (🔥 NEW)
      =============================== */
      .addCase(fetchGroupPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroupPosts.fulfilled, (state, action) => {
        const { groupId, posts } = action.payload;
        state.loading = false;

        state.groupPosts[groupId] = posts.map((post) => ({
          ...post,
          isSaved: post.isSaved ?? false,
        }));
      })
      .addCase(fetchGroupPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         FETCH SINGLE POST
      =============================== */
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

      /* ===============================
         CREATE POST (USER + GROUP)
      =============================== */
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        const post = {
          ...action.payload.post,
          isSaved: false,
        };

        if (post.contextType === "GROUP") {
          if (!state.groupPosts[post.contextId]) {
            state.groupPosts[post.contextId] = [];
          }
          state.groupPosts[post.contextId].unshift(post);
        } else {
          state.posts.unshift(post);
        }
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         DELETE POST (EVERYWHERE)
      =============================== */
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        const postId = action.payload;

        state.posts = state.posts.filter((p) => p._id !== postId);

        Object.keys(state.groupPosts).forEach((gid) => {
          state.groupPosts[gid] = state.groupPosts[gid].filter(
            (p) => p._id !== postId
          );
        });

        if (state.selectedPost?._id === postId) {
          state.selectedPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===============================
         LIKE POST
      =============================== */
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const { postId, likes, isLiked } = action.payload;

        updatePostEverywhere(state, postId, (post) => {
          post.likes = likes;
          post.isLiked = isLiked;
        });
      })

      /* ===============================
         SAVE POST
      =============================== */
      .addCase(toggleSavePost.fulfilled, (state, action) => {
        const { postId, isSaved } = action.payload;

        updatePostEverywhere(state, postId, (post) => {
          post.isSaved = isSaved;
        });
      })

      /* ===============================
         ADD COMMENT
      =============================== */
      .addCase(addComment.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;

        updatePostEverywhere(state, postId, (post) => {
          post.comments.push(comment);
        });
      })

      /* ===============================
         DELETE COMMENT
      =============================== */
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { postId, commentId } = action.payload;

        updatePostEverywhere(state, postId, (post) => {
          post.comments = post.comments.filter(
            (c) => c._id !== commentId
          );
        });
      });
  },
});

export const { clearPosts, clearSelectedPost } = postSlice.actions;
export default postSlice.reducer;
