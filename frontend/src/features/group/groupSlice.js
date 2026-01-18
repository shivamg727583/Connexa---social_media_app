import { createSlice } from "@reduxjs/toolkit";
import {
  fetchMyGroups,
  fetchAllGroups,
  fetchGroupById,
  createGroup,
  joinGroup,
  cancelJoinRequest,
  approveGroupMember,
  removeMember,
  updateGroupCover,
  updateGroupAvatar,
} from "./groupThunks";

const initialState = {
  myGroups: [],
  allGroups: [],
  selectedGroup: null,
  loading: false,
  error: null,
};

const groupSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    clearSelectedGroup: (state) => {
      state.selectedGroup = null;
    },
    addGroupNotification: (state, action) => {
      const notification = action.payload;
      if (state.selectedGroup && state.selectedGroup._id === notification.groupId) {
        if (notification.type === "join_request") {
          if (!state.selectedGroup.joinRequests) {
            state.selectedGroup.joinRequests = [];
          }
          state.selectedGroup.joinRequests.push(notification.user);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.myGroups = action.payload;
      })
      .addCase(fetchMyGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchAllGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.allGroups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchGroupById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroupById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGroup = action.payload;
      })
      .addCase(fetchGroupById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.myGroups.unshift(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(joinGroup.fulfilled, (state, action) => {
        const { groupId } = action.payload;
        state.allGroups = state.allGroups.filter((g) => g._id !== groupId);
      })

      .addCase(cancelJoinRequest.fulfilled, (state, action) => {
        const groupId = action.payload;
        const groupIndex = state.myGroups.findIndex((g) => g._id === groupId);
        if (groupIndex !== -1) {
          state.myGroups.splice(groupIndex, 1);
        }
      })

      .addCase(approveGroupMember.fulfilled, (state, action) => {
        const { groupId, memberId, reject } = action.payload;

        const updateGroup = (group) => {
          if (!group || group._id !== groupId) return;

          group.joinRequests = group.joinRequests?.filter(
            (u) => u._id !== memberId
          ) || [];

          if (!reject) {
            const requestUser = group.joinRequests?.find(
              (u) => u._id === memberId
            );
            if (requestUser && !group.members.some((m) => m._id === memberId)) {
              group.members.push(requestUser);
            }
          }
        };

        if (state.selectedGroup?._id === groupId) {
          updateGroup(state.selectedGroup);
        }

        const myGroupIndex = state.myGroups.findIndex((g) => g._id === groupId);
        if (myGroupIndex !== -1) {
          updateGroup(state.myGroups[myGroupIndex]);
        }
      })

      .addCase(removeMember.fulfilled, (state, action) => {
        const { groupId, memberId } = action.payload;

        const updateGroup = (group) => {
          if (!group || group._id !== groupId) return;
          group.members = group.members?.filter((m) => m._id !== memberId) || [];
        };

        if (state.selectedGroup?._id === groupId) {
          updateGroup(state.selectedGroup);
        }

        const myGroupIndex = state.myGroups.findIndex((g) => g._id === groupId);
        if (myGroupIndex !== -1) {
          updateGroup(state.myGroups[myGroupIndex]);
        }
      })

      .addCase(updateGroupCover.fulfilled, (state, action) => {
        const { groupId, coverImage } = action.payload;

        if (state.selectedGroup?._id === groupId) {
          state.selectedGroup.coverImage = coverImage;
        }

        const myGroupIndex = state.myGroups.findIndex((g) => g._id === groupId);
        if (myGroupIndex !== -1) {
          state.myGroups[myGroupIndex].coverImage = coverImage;
        }
      })

      .addCase(updateGroupAvatar.fulfilled, (state, action) => {
        const { groupId, avatar } = action.payload;

        if (state.selectedGroup?._id === groupId) {
          state.selectedGroup.avatar = avatar;
        }

        const myGroupIndex = state.myGroups.findIndex((g) => g._id === groupId);
        if (myGroupIndex !== -1) {
          state.myGroups[myGroupIndex].avatar = avatar;
        }
      });
  },
});

export const { clearSelectedGroup, addGroupNotification } = groupSlice.actions;
export default groupSlice.reducer;