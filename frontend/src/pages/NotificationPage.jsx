import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  UserPlus,
  Users,
  Trash2,
  CheckCheck,
} from "lucide-react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/features/notification/notificationThunk";
import { formatTime } from "@/lib/formatTime";

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, } =
    useSelector((state) => state.notifications);

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleMarkAsRead = (notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "post_like":
        return (
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
          </div>
        );
      case "post_comment":
        return (
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-blue-500" />
          </div>
        );
      case "friend_request":
        return (
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <UserPlus className="w-6 h-6 text-green-500" />
          </div>
        );
      case "friend_accept":
        return (
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-500" />
          </div>
        );
      default:
        return null;
    }
  };

  const getNotificationLink = (notification) => {
    switch (notification.type) {
      case "post_like":
      case "post_comment":
        return `/post/${notification.post?._id}`;
      case "friend_request":
      case "friend_accept":
        return `/profile/${notification.sender?._id}`;
      default:
        return "#";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay updated with your activity
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "unread"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </button>
              <button
                onClick={() => setFilter("read")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === "read"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
              >
                Read
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>


        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <CheckCheck className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm">You&apos;re all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`group hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 ${!notification.read
                      ? "bg-blue-50/50 dark:bg-blue-900/10"
                      : ""
                    }`}
                >
                  <div className="flex items-start gap-4 p-6">

                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          notification.sender?.profilePicture ||
                          "/default-avatar.png"
                        }
                        alt={notification.sender?.username}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
                      />
                      <div className="absolute -bottom-1 -right-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>


                    <Link
                      to={getNotificationLink(notification)}
                      onClick={() => {
                        if (!notification.read) {
                          handleMarkAsRead(notification._id);
                        }
                      }}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-base text-gray-900 dark:text-white mb-1">
                        <span className="font-bold">
                          {notification.sender?.username}
                        </span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">
                          {notification.message.replace(
                            notification.sender?.username,
                            ""
                          )}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatTime( notification?.createdAt)}
                      </p>
                    </Link>


                    {notification.post?.image && (
                      <Link
                        to={`/post/${notification.post._id}`}
                        className="flex-shrink-0"
                      >
                        <img
                          src={notification.post.image}
                          alt="Post"
                          className="w-16 h-16 rounded-lg object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                    )}


                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors"
                          title="Mark as read"
                        >
                          <CheckCheck className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification._id)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>


                    {!notification.read && (
                      <div className="flex-shrink-0 w-3 h-3 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;