import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import LeftSidebar from "./LeftSidebar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <LeftSidebar />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 md:ml-20 lg:ml-64 pt-16 md:pt-0 pb-20 md:pb-6"
      >
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;