import { combineReducers } from "@reduxjs/toolkit";

import auth from "@/features/auth/authSlice";
import post from "@/features/post/postSlice";
import message from "@/features/message/messageSlice";
import friends from "@/features/friends/friendSlice";
import notifications from "@/features/notification/notificationSlice";
import search from "@/features/search/searchSlice";

const rootReducer = combineReducers({
  auth,
  post,
  message,
  friends,
  notifications,
  search,

});

export default rootReducer;
