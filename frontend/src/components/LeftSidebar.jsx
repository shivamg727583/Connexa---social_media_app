import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Home,
  Search,
  MessageCircle,
  Bell,
  PlusSquare,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import CreatePost from "./CreatePost";
import { logout } from "@/features/auth/authSlice";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);

  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sidebarItems = [
    { icon: Home, text: "Home", path: "/" },
    { icon: Search, text: "Search", path: "/search" },
    { icon: MessageCircle, text: "Messages", path: "/chat" },
    { 
      icon: Bell, 
      text: "Notifications", 
      path: "/notifications", 
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { 
      icon: PlusSquare, 
      text: "Create", 
      action: () => setCreatePostOpen(true) 
    },
  ];

  const handleNavigation = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="hidden lg:flex items-center gap-2 px-4 py-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Connexa
        </h1>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 lg:px-3 py-4 lg:py-0">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.text}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleNavigation(item)}
              className="relative flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group"
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="hidden lg:block font-medium">{item.text}</span>
            </motion.button>
          );
        })}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            navigate(`/profile/${user?._id}`);
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <Avatar className="w-6 h-6 lg:w-7 lg:h-7">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
          </Avatar>
          <span className="hidden lg:block font-medium">Profile</span>
        </motion.button>
      </nav>

      <div className="px-2 lg:px-3 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all w-full"
        >
          <LogOut className="w-6 h-6" />
          <span className="hidden lg:block font-medium">Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-col"
      >
        <SidebarContent />
      </motion.aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Connexa
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="w-80 h-full bg-white dark:bg-gray-950 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <h1 className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Connexa
                </h1>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <SidebarContent />
          </motion.div>
        </motion.div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 px-2 py-2">
        <div className="flex justify-around items-center">
          {[
            { icon: Home, path: "/" },
            { icon: Search, path: "/search" },
            { icon: PlusSquare, action: () => setCreatePostOpen(true) },
            { icon: MessageCircle, path: "/chat" },
            
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() =>
                  item.action ? item.action() : navigate(item.path)
                }
                className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Icon className="w-6 h-6" /> 
              </button>
            );
          })}
          <button
            onClick={() => navigate(`/profile/${user?._id}`)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Avatar className="w-7 h-7">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>

      <CreatePost open={createPostOpen} setOpen={setCreatePostOpen} />
    </>
  );
};

export default LeftSidebar;