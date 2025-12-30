import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";


import { fetchAllPosts } from "@/features/post/postThunks";
import { getSuggestedUsers } from "@/features/auth/authThunks";
import RightSidebar from "@/components/RightSidebar";
import Feed from "@/components/Feed";

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPosts());
    dispatch(getSuggestedUsers());
  }, [dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center min-h-screen"
    >
      <div className="w-full max-w-7xl flex gap-8 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
          <Feed />
        </div>

        <div className="hidden xl:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <RightSidebar />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;