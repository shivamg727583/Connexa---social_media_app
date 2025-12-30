import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import Post from "./Post";
import PostSkeleton from "./ui/PostSkeleton";

const Posts = () => {
  const { posts, loading } = useSelector((s) => s.post);

  if (loading) {
    return (
      <div className="w-full max-w-xl space-y-6">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <p className="mt-20 text-gray-500 text-center">
        No posts yet
      </p>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-8">
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Post post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Posts;
