import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, X, Heart, MessageCircle, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/features/notification/notificationThunk";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const { notifications, unreadCount, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    if (unreadCount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const handleRead = (id) => {
    dispatch(markNotificationAsRead(id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "post_like":
        return <Heart className="w-4 h-4 text-red-500" fill="currentColor" />;
      case "post_comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "friend_request":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "friend_accept":
        return <Users className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getLink = (n) => {
    if (n.post?._id) return `/post/${n.post._id}`;
    if (n.sender?._id) return `/profile/${n.sender._id}`;
    return "#";
  };

  return (
    <div ref={dropdownRef} className="relative">
     
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[95vw] max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl z-[9999] animate-slideDown">
        
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllNotificationsAsRead())}
                className="text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          
          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="py-10 flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-10 text-center text-gray-500">
                No notifications yet
              </div>
            )}

            {notifications.map((n) => (
              <Link
                key={n._id}
                to={getLink(n)}
                onClick={() => {
                  if (!n.read) handleRead(n._id);
                  setIsOpen(false);
                }}
                className={`flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={n.sender?.profilePicture || "/default-avatar.png"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 p-1 rounded-full">
                    {getIcon(n.type)}
                  </span>
                </div>

                <div className="flex-1 text-sm">
                  <p className="font-medium">
                    {n.sender?.username}{" "}
                    {n.message.replace(n.sender?.username, "")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, n._id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </Link>
            ))}
          </div>

       
          {notifications.length > 0 && (
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center p-3 text-blue-600 hover:underline border-t dark:border-gray-700"
            >
              View all notifications
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
