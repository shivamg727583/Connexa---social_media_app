import { createSlice } from "@reduxjs/toolkit";
import * as thunks from "./authThunks";
import { toggleSavePost } from "../post/postThunks";

const initialState = {
  user: null,
  profile: null,
  suggestedUsers: [],
  userProfile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.profile = null;
      state.userProfile = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    Object.values(thunks).forEach((thunk) => {
      builder.addCase(thunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(thunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    });

    builder
      .addCase(thunks.loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(thunks.registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(thunks.fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.user;
        state.isAuthenticated = true;
      })

      .addCase(thunks.fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.userProfile = action.payload.user;
      })

      .addCase(thunks.editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.user;
      })

      .addCase(thunks.getSuggestedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestedUsers = action.payload.suggestedUsers;
      })

      .addCase(toggleSavePost.fulfilled, (state, action) => {
        if (!state.user) return;

        const { postId, isSaved } = action.payload;

        if (!state.user.savedPosts) {
          state.user.savedPosts = [];
        }

        if (isSaved) {
          const postIdStr = postId.toString();
          const alreadySaved = state.user.savedPosts.some(
            (id) => id.toString() === postIdStr
          );

          if (!alreadySaved) {
            state.user.savedPosts.push(postId);
          }
        } else {
          const postIdStr = postId.toString();
          state.user.savedPosts = state.user.savedPosts.filter(
            (id) => id.toString() !== postIdStr
          );
        }

        if (state.profile) {
          state.profile.savedPosts = state.user.savedPosts;
        }
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
