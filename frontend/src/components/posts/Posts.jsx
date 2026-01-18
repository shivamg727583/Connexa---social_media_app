import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import Post from "@/components/posts/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";

const SuggestedUsersInline = lazy(() => import("@/components/friends/suggestedUsersInline"));

const Posts = () => {
  const { posts, loading } = useSelector((s) => s.post);

  if (loading) {
    return (
      <div className="w-full max-w-xl space-y-4 sm:space-y-6">
        {[...Array(3)].map((_, i) => <PostSkeleton key={i} />)}
      </div>
    );
  }

  if (!posts?.length) {
    return <p className="mt-20 text-gray-500 text-center text-sm sm:text-base">No posts yet</p>;
  }

  return (
    <div className="w-full max-w-xl space-y-6 sm:space-y-8">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Post post={post} />
            {index === 4 && (
              <Suspense fallback={null}>
                <SuggestedUsersInline />
              </Suspense>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Posts;
