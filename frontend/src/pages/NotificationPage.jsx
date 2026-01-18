import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCheck, Bell } from "lucide-react";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/features/notification/notificationThunk";
import { PageContainer, PageHeader, ContentWrapper, LoadingSpinner, EmptyState, TabNavigation } from "@/components/shared/PageLayout";
import NotificationItem from "@/components/notification/NotificationItem";


const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector((state) => state.notifications);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 50 }));
  }, [dispatch]);

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "read", label: "Read" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your activity"
        icon={Bell}
        action={
          unreadCount > 0 && (
            <button
              onClick={() => dispatch(markAllNotificationsAsRead())}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base"
            >
              <CheckCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Mark all as read</span>
              <span className="sm:hidden">Mark all</span>
            </button>
          )
        }
      />

      <ContentWrapper maxWidth="4xl">
        <div className="mb-4 sm:mb-6">
          <TabNavigation tabs={tabs} activeTab={filter} onChange={setFilter} />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : filteredNotifications.length === 0 ? (
            <EmptyState
              icon={CheckCheck}
              title="No notifications"
              description="You're all caught up!"
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={(id) => dispatch(markNotificationAsRead(id))}
                  onDelete={(id) => dispatch(deleteNotification(id))}
                />
              ))}
            </div>
          )}
        </div>
      </ContentWrapper>
    </PageContainer>
  );
};

export default NotificationsPage;