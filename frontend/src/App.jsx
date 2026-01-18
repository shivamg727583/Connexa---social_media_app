import { useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import MainLayout from "./components/layouts/MainLayout";
import ProtectedRoutes from "./components/auth/ProtectedRoutes";
import EditProfile from "./components/profile/EditProfile";

import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";

import NotificationsPage from "./pages/NotificationPage";
import FriendsPage from "./pages/FriendsPage";
import SearchPage from "./pages/SearchPage";

import {
  fetchIncomingRequests,
  fetchSentRequests,
} from "./features/friends/friendThunks";
import { fetchNotifications } from "./features/notification/notificationThunk";
import { fetchAllConversations } from "./features/message/messageThunk";
import { connectSocket, disconnectSocket } from "./services/socket";
import useSocketEvents from "./hooks/useSocketEvents";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import MessagesPage from "./pages/MessagePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import SuggestedUsersPage from "./pages/SuggestedUserPage";
import GroupsPage from "./pages/GroupPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import { fetchAllPosts } from "./features/post/postThunks";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/profile/:id", element: <ProfilePage /> },
      { path: "/account/edit", element: <EditProfile /> },
      { path: "/chat", element: <ChatPage /> },
      { path: "/chat/:id", element: <MessagesPage /> },
      { path: "profile/:id/friends", element: <FriendsPage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      {path:"/post/:id",element:<PostPage/>},
      {path:"/suggested",element:<SuggestedUsersPage/>},
      {path:"/groups",element:<GroupsPage />},
      {path:"/groups/:id",element:<GroupDetailPage />}

    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "*", element: <NotFoundPage /> },
]);

const App = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);


  useEffect(() => {
    if (!user?._id) return;

    connectSocket(user._id);

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    
    dispatch(fetchIncomingRequests());
    dispatch(fetchSentRequests());
    dispatch(fetchAllPosts())
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
    dispatch(fetchAllConversations());
  }, [dispatch, user?._id]);

  useSocketEvents();

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;