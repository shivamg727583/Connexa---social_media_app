import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "@/services/socket";
import {
  addSocketMessage,
  setOnlineUsers,
  setTyping,
} from "@/features/message/messageSlice";
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

    socket.on("newMessage", handleNewMessage);
    socket.on("getOnlineUsers", handleOnlineUsers);
    socket.on("typing", handleTyping);
    socket.on("notification", handleNotification);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("getOnlineUsers", handleOnlineUsers);
      socket.off("typing", handleTyping);
      socket.off("notification", handleNotification);
    };
  }, [dispatch, user?._id]);
};

export default useSocketEvents;
