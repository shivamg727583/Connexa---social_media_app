import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";

import Post from "@/components/posts/Post";
import PostSkeleton from "@/components/ui/PostSkeleton";

const SuggestedUsersInline = lazy(() =>
  import("@/components/friends/suggestedUsersInline")
);

const Posts = () => {
  const { posts, loading } = useSelector((s) => s.post);

  if (loading) {
    return (
      <div className="w-full max-w-xl space-y-4 sm:space-y-6">
        {[...Array(3)].map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  // NO POSTS
  if (!posts?.length) {
    return (
      <div className="w-full max-w-xl space-y-6">
        <p className="mt-10 text-gray-500 text-center text-sm sm:text-base">
          No posts yet
        </p>

       <div className="block lg:hidden">
  <Suspense fallback={null}>
    <SuggestedUsersInline />
  </Suspense>
</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl space-y-6 sm:space-y-8">
      <AnimatePresence>
        {posts.map((post, index) => {
          const shouldShowSuggestions =
            // For small feeds (1-3 posts), show after last post
            (posts.length <= 3 && index === posts.length - 1) ||

            // For larger feeds, show after 4th post
            (posts.length > 3 && index === 3) ||

            // Optional: repeat every 7 posts
            (posts.length > 8 && (index + 1) % 7 === 0);

          return (
            <motion.div
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <Post post={post} />

              {shouldShowSuggestions && (
  <div className="block lg:hidden">
    <Suspense fallback={null}>
      <SuggestedUsersInline />
    </Suspense>
  </div>
)}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Posts;