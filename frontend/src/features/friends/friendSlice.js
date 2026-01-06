import { createSlice } from "@reduxjs/toolkit";
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  fetchIncomingRequests,
  fetchSentRequests,
  fetchFriends,
  cancelFriendRequest,
  fetchMutualFriends,
} from "./friendThunks";

const initialState = {
  profileFriends: [],
  myFriends: [],
  requests: [],
  sentRequests: [],
  mutualFriends: {},
  loading: false,
  error: null,
};

const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    resetFriendState: () => initialState,

    addIncomingRequest: (state, action) => {
      const exists = state.requests.some((r) => r._id === action.payload._id);
      if (!exists) {
        state.requests.unshift(action.payload);
      }
    },

   addFriend: (state, action) => {
  const friend = action.payload;

  if (!state.myFriends.some(f => f._id === friend._id)) {
    state.myFriends.unshift(friend);
  }

  state.requests = state.requests.filter(
    r => r.from !== friend._id && r.from?._id !== friend._id
  );

  state.sentRequests = state.sentRequests.filter(
    r => r.to !== friend._id && r.to?._id !== friend._id
  );
},


    removeRequest: (state, action) => {
      state.requests = state.requests.filter((r) => r._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // SEND REQUEST
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests.push(action.payload.request);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ACCEPT REQUEST
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
  state.loading = false;

  state.requests = state.requests.filter(
    r => r._id !== action.payload.requestId
  );

  if (action.payload.friend) {
    if (!state.myFriends.some(f => f._id === action.payload.friend._id)) {
      state.myFriends.push(action.payload.friend);
    }
  }
})

      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REJECT REQUEST
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = state.requests.filter(
          (r) => r._id !== action.payload.requestId
        );
         
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH INCOMING REQUESTS
      .addCase(fetchIncomingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIncomingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchIncomingRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH SENT REQUESTS
      .addCase(fetchSentRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSentRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests = action.payload;
      })
      .addCase(fetchSentRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH FRIENDS
      .addCase(fetchFriends.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.loading = false;

        if (action.payload.isMe) {
          state.myFriends = action.payload.friends;
        } else {
          state.profileFriends = action.payload.friends;
        }
      })

      .addCase(fetchFriends.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CANCEL REQUEST
      .addCase(cancelFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.sentRequests = state.sentRequests.filter(
          (r) => r.to !== action.payload && r.to?._id !== action.payload
        );
      })
      .addCase(cancelFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH MUTUAL FRIENDS
      .addCase(fetchMutualFriends.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchMutualFriends.fulfilled, (state, action) => {
        state.mutualFriends[action.payload.userId] = action.payload.data;
      })
      .addCase(fetchMutualFriends.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  resetFriendState,
  addIncomingRequest,
  addFriend,
  removeRequest,
} = friendSlice.actions;
export default friendSlice.reducer;
