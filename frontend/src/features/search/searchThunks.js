import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSearchResultsApi } from "./searchApi";
import { toast } from "sonner";

export const searchUsers = createAsyncThunk(
  "search/users",
  async (query, { rejectWithValue }) => {
    try {
      if (!query || !query.trim()) {
        return [];
      }

      const res = await getSearchResultsApi(query);

      return res.data.users;
    } catch (err) {
      toast.error("Failed to fetch search results");
      return rejectWithValue(
        err.response?.data?.message || "Search failed"
      );
    }
  }
);
