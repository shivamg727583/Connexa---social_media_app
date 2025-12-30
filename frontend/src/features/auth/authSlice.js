import { createSlice } from "@reduxjs/toolkit";
import * as thunks from "./authThunks";

const initialState = {
  user: null,
  profile:null,
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
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    Object.values(thunks).forEach((thunk) => {
      builder.addCase(thunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      });
      builder.addCase(thunk.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
    });

    builder
      .addCase(thunks.loginUser.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.isAuthenticated = true;
      })
       .addCase(thunks.registerUser.fulfilled, (s) => {
    s.loading = false;
  })
      .addCase(thunks.fetchProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload.user;
        s.isAuthenticated = true;
      })
      .addCase(thunks.fetchProfileById.fulfilled, (s, a) => {
        s.loading = false;
        s.userProfile = a.payload.user;
      })
      .addCase(thunks.editProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.profile = a.payload.user;
      })
      .addCase(thunks.getSuggestedUsers.fulfilled, (s, a) => {
        s.loading = false;
        s.suggestedUsers = a.payload.suggestedUsers;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
