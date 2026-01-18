import { combineReducers } from "@reduxjs/toolkit";

import auth from "@/features/auth/authSlice";
import post from "@/features/post/postSlice";
import message from "@/features/message/messageSlice";
import friends from "@/features/friends/friendSlice";
import notifications from "@/features/notification/notificationSlice";
import search from "@/features/search/searchSlice";
import group from "@/features/group/groupSlice";


const rootReducer = combineReducers({
  auth,
  post,
  message,
  friends,
  notifications,
  search,
group
});

export default rootReducer;
