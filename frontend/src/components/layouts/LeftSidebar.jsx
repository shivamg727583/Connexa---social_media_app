import { useState, lazy, Suspense } from "react";
import { useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { Home, Search, MessageCircle, Bell, PlusSquare, LogOut, Menu, X, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/authSlice";
import Logo from "@/components/ui/logo";
import NavItem from "@/components/layouts/NavItem";

const CreatePost = lazy(() => import("@/components/posts/CreatePost"));





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
    { icon: Users, text: "Groups", path: "/groups" },
    { icon: Bell, text: "Notifications", path: "/notifications", badge: unreadCount > 0 ? unreadCount : null },
    { icon: PlusSquare, text: "Create", action: () => setCreatePostOpen(true) },
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

  const SidebarContent = ({ isMobile = false }) => (
    <>
      {!isMobile && (
        <div className="hidden lg:flex items-center gap-2 px-3 sm:px-4 py-4 sm:py-6">
          <Logo />
        </div>
      )}

      <nav className="flex-1 flex flex-col gap-1 px-2 lg:px-3 py-4 lg:py-0">
        {sidebarItems.map((item) => (
          <NavItem
            key={item.text}
            item={item}
            onClick={() => handleNavigation(item)}
            showLabel={isMobile || true}
          />
        ))}

        <NavItem
          item={{
            icon: () => (
              <Avatar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                <AvatarImage src={user?.profilePicture} />
                <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
              </Avatar>
            ),
            text: "Profile",
          }}
          onClick={() => {
            navigate(`/profile/${user?._id}`);
            setMobileMenuOpen(false);
          }}
          showLabel={isMobile || true}
        />
      </nav>

      <div className="px-2 lg:px-3 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-all w-full"
        >
          <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="hidden lg:block font-medium text-sm sm:text-base">Logout</span>
        </motion.button>
      </div>
    </>
  );

  SidebarContent.propTypes = {
    isMobile: PropTypes.bool,
  };

  return (
    <>
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-20 lg:w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex-col"
      >
        <SidebarContent />
      </motion.aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-3 sm:px-4 py-3 flex items-center justify-between">
        <Logo size="small" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/groups")} className="w-9 h-9">
            <Users className="w-5 h-5" />
          </Button>

          <button
            onClick={() => navigate("/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="w-9 h-9">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
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
                <Logo />
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <SidebarContent isMobile={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                onClick={() => (item.action ? item.action() : navigate(item.path))}
                className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

      <Suspense fallback={null}>
        <CreatePost open={createPostOpen} setOpen={setCreatePostOpen} />
      </Suspense>
    </>
  );
};


export default LeftSidebar;