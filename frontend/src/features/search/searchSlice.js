import { createSlice } from "@reduxjs/toolkit";
import { searchUsers } from "./searchThunks";

const searchSlice = createSlice({
  name: "search",
  initialState: {
    users: [],
    loading: false,
    error: null,
    query: "",
  },
  reducers: {
    clearSearch(state) {
      state.users = [];
      state.query = "";
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state, action) => {
        state.loading = true;
        state.query = action.meta.arg;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
