import { createSlice } from "@reduxjs/toolkit";
import { deleteNotification, fetchNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "./notificationThunk";


const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addSocketNotification: (state, action) => {
      // Add notification to the beginning
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    clearNotifications: () => initialState,
    decrementUnreadCount: (state) => {
      if (state.unreadCount > 0) {
        state.unreadCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1 && !state.notifications[index].read) {
          state.notifications[index].read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark all as read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          read: true,
        }));
        state.unreadCount = 0;
      })

      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n._id === action.payload
        );
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );
      });
  },
});

export const { addSocketNotification, clearNotifications, decrementUnreadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;