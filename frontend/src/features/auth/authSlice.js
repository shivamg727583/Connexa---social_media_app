import { createSlice } from "@reduxjs/toolkit";
import * as thunks from "./authThunks";
import { toggleSavePost } from "@/features/post/postThunks";

const initialState = {
  user: null,
  profile: null,
  suggestedUsers: [],
  userProfile: null,
  loading: {
    login: false,
    register: false,
    authCheck: false,
    profile: false,
    suggested: false,
    editProfile: false,
  },

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
      state.error = null;

      Object.keys(state.loading).forEach(
        (key) => (state.loading[key] = false)
      );

      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(thunks.loginUser.pending, (state) => {
        state.loading.login = true;
        state.error = null;
      })
      .addCase(thunks.loginUser.fulfilled, (state, action) => {
        state.loading.login = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(thunks.loginUser.rejected, (state, action) => {
        state.loading.login = false;
        state.error = action.payload;
      });

    builder
      .addCase(thunks.registerUser.pending, (state) => {
        state.loading.register = true;
        state.error = null;
      })
      .addCase(thunks.registerUser.fulfilled, (state) => {
        state.loading.register = false;
      })
      .addCase(thunks.registerUser.rejected, (state, action) => {
        state.loading.register = false;
        state.error = action.payload;
      });

    builder
      .addCase(thunks.fetchProfile.pending, (state) => {
        state.loading.authCheck = true;
        state.error = null;
      })
      .addCase(thunks.fetchProfile.fulfilled, (state, action) => {
        state.loading.authCheck = false;
        state.user = action.payload.user;
        state.profile = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(thunks.fetchProfile.rejected, (state, action) => {
        state.loading.authCheck = false;
        state.error = action.payload;
      });

    builder
      .addCase(thunks.fetchProfileById.pending, (state) => {
        state.loading.profile = true;
      })
      .addCase(thunks.fetchProfileById.fulfilled, (state, action) => {
        state.loading.profile = false;
        state.userProfile = action.payload.user;
      })
      .addCase(thunks.fetchProfileById.rejected, (state, action) => {
        state.loading.profile = false;
        state.error = action.payload;
      });

    builder
      .addCase(thunks.editProfile.pending, (state) => {
        state.loading.editProfile = true;
      })
      .addCase(thunks.editProfile.fulfilled, (state, action) => {
        state.loading.editProfile = false;
        state.user = action.payload.user;
        state.profile = action.payload.user;
      })
      .addCase(thunks.editProfile.rejected, (state, action) => {
        state.loading.editProfile = false;
        state.error = action.payload;
      });

    builder
      .addCase(thunks.getSuggestedUsers.pending, (state) => {
        state.loading.suggested = true;
      })
      .addCase(thunks.getSuggestedUsers.fulfilled, (state, action) => {
        state.loading.suggested = false;
        state.suggestedUsers = action.payload.suggestedUsers;
      })
      .addCase(thunks.getSuggestedUsers.rejected, (state, action) => {
        state.loading.suggested = false;
        state.error = action.payload;
      });

    builder.addCase(toggleSavePost.fulfilled, (state, action) => {
      if (!state.user) return;

      const { postId, isSaved } = action.payload;

      if (!state.user.savedPosts) {
        state.user.savedPosts = [];
      }

      const postIdStr = postId.toString();

      if (isSaved) {
        const alreadySaved = state.user.savedPosts.some(
          (id) => id.toString() === postIdStr
        );

        if (!alreadySaved) {
          state.user.savedPosts.push(postId);
        }
      } else {
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
