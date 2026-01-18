import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Trash2, CheckCheck } from "lucide-react";
import { formatTime } from "@/lib/formatTime";
import NotificationIcon from "@/components/notification/NotificationIcon";


const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getLink = () => {
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

  return (
    <div className={`group hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/10" : ""}`}>
      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-6">
        <div className="relative flex-shrink-0">
          <img
            src={notification.sender?.profilePicture || "/default-avatar.png"}
            alt={notification.sender?.username}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white dark:ring-gray-900"
          />
          <div className="absolute -bottom-1 -right-1">
            <NotificationIcon type={notification.type} />
          </div>
        </div>

        <Link
          to={getLink()}
          onClick={() => !notification.read && onMarkAsRead(notification._id)}
          className="flex-1 min-w-0"
        >
          <p className="text-sm sm:text-base text-gray-900 dark:text-white mb-1">
            <span className="font-bold">{notification.sender?.username}</span>{" "}
            <span className="text-gray-700 dark:text-gray-300">
              {notification.message.replace(notification.sender?.username, "")}
            </span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            {formatTime(notification?.createdAt)}
          </p>
        </Link>

        {notification.post?.image && (
          <Link to={`/post/${notification.post._id}`} className="flex-shrink-0 hidden sm:block">
            <img src={notification.post.image} alt="Post" className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover hover:scale-105 transition" />
          </Link>
        )}

        <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition">
          {!notification.read && (
            <button
              onClick={() => onMarkAsRead(notification._id)}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
              title="Mark as read"
            >
              <CheckCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification._id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {!notification.read && (
          <div className="flex-shrink-0 w-2 h-2 sm:w-3 sm:h-3 bg-blue-600 rounded-full"></div>
        )}
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.object.isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NotificationItem;