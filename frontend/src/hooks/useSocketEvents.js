import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/services/socket";
import {
  addConversation,
  addSocketMessage,
  setOnlineUsers,
  setTyping,
} from "@/features/message/messageSlice";
import {
  addIncomingRequest,
  removeRequest,
  addFriend,
} from "@/features/friends/friendSlice";

import { addSocketNotification } from "@/features/notification/notificationSlice";
import { toast } from "sonner";

const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) {
      console.warn(" User not logged in, skipping socket events");
      return;
    }

    const socket = getSocket();
    if (!socket) {
      return;
    }

    const handleNewMessage = (data) => {
      dispatch(addSocketMessage(data));
    };

    const handleOnlineUsers = (users) => {
      dispatch(setOnlineUsers(users));
    };

    const handleTyping = ({ userId, isTyping }) => {
      dispatch(setTyping({ userId, isTyping }));
    };

    const handleNewConversation = (conversation) => {
      dispatch(addConversation(conversation));
    };

    const handleNotification = (notification) => {
      dispatch(addSocketNotification(notification));

      const messageMap = {
        friend_request: "sent you a friend request",
        friend_accept: "accepted your friend request",
        post_like: "liked your post",
        post_comment: "commented on your post",
      };

      const message =
        messageMap[notification.type] || "sent you a notification";
      const username = notification.sender?.username || "Someone";

      toast.success(`${username} ${message}`, {
        description: "Click to view",
        duration: 4000,
      });
    };

    const handleFriendRequestReceived = ({ request }) => {
      dispatch(addIncomingRequest(request));
    };

    const handleFriendRequestAccepted = ({ friend, requestId }) => {
  dispatch(addFriend(friend));
  dispatch(removeRequest(requestId));
};


   const handleFriendRequestRejected = ({ requestId }) => {
  dispatch(removeRequest(requestId));
};


    socket.on("newMessage", handleNewMessage);
    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("newConversation", handleNewConversation);
    socket.on("notification", handleNotification);
    socket.on("friendRequestReceived", handleFriendRequestReceived);
    socket.on("friendRequestAccepted", handleFriendRequestAccepted);
    socket.on("friendRequestRejected", handleFriendRequestRejected);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("newConversation", handleNewConversation);
      socket.off("notification", handleNotification);
      socket.off("friendRequestReceived", handleFriendRequestReceived);
      socket.off("friendRequestAccepted", handleFriendRequestAccepted);
      socket.off("friendRequestRejected", handleFriendRequestRejected);
    };
  }, [ user?._id]);
};

export default useSocketEvents;
