import { useState, useEffect, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Bell, X, Heart, MessageCircle, UserPlus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/features/notification/notificationThunk";

const NotificationIcon = memo(({ type }) => {
  const icons = {
    post_like: <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" fill="currentColor" />,
    post_comment: <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />,
    friend_request: <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />,
    friend_accept: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />,
  };
  return icons[type] || <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
});

NotificationIcon.displayName = "NotificationIcon";
NotificationIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);

  useEffect(() => {
    if (unreadCount > 0) {
      setShake(true);
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  useEffect(() => {
    if (isOpen) dispatch(fetchNotifications({ page: 1, limit: 20 }));
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

  const getLink = (n) => {
    if (n.post?._id) return `/post/${n.post._id}`;
    if (n.sender?._id) return `/profile/${n.sender._id}`;
    return "#";
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${shake ? "animate-shake" : ""}`}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 text-[10px] sm:text-xs flex items-center justify-center bg-red-500 text-white rounded-full font-bold">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 w-[95vw] max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-xl z-[9999] animate-slideDown">
          <div className="flex justify-between items-center p-3 sm:p-4 border-b dark:border-gray-700">
            <h3 className="font-semibold text-base sm:text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => dispatch(markAllNotificationsAsRead())}
                className="text-xs sm:text-sm text-blue-600 hover:underline"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
            {loading && (
              <div className="py-10 flex justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {!loading && notifications.length === 0 && (
              <div className="py-10 text-center text-gray-500 text-sm">
                No notifications yet
              </div>
            )}

            {notifications.map((n) => (
              <Link
                key={n._id}
                to={getLink(n)}
                onClick={() => {
                  if (!n.read) dispatch(markNotificationAsRead(n._id));
                  setIsOpen(false);
                }}
                className={`flex gap-2 sm:gap-3 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!n.read ? "bg-blue-50 dark:bg-blue-900/20" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={n.sender?.profilePicture || "/default-avatar.png"}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
                    alt={n.sender?.username}
                  />
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 p-0.5 sm:p-1 rounded-full">
                    <NotificationIcon type={n.type} />
                  </span>
                </div>

                <div className="flex-1 text-xs sm:text-sm min-w-0">
                  <p className="font-medium">
                    {n.sender?.username}{" "}
                    {n.message.replace(n.sender?.username, "")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, n._id)}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full flex-shrink-0"
                >
                  <X className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </button>
              </Link>
            ))}
          </div>

          {notifications.length > 0 && (
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center p-2 sm:p-3 text-xs sm:text-sm text-blue-600 hover:underline border-t dark:border-gray-700"
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
