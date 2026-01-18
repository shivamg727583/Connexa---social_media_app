import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

import { fetchGroupPosts } from "@/features/post/postThunks";
import Post from "@/components/Post";

const GroupPostFeed = ({ groupId }) => {
  const dispatch = useDispatch();
  const { groupPosts, loading } = useSelector((state) => state.post);

  const posts = groupPosts[groupId] || [];

  useEffect(() => {
    if (groupId) dispatch(fetchGroupPosts(groupId));
  }, [groupId, dispatch]);

  /* ---------- LOADING ---------- */
  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-10 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-gray-700">
          No posts yet
        </h3>
        <p className="text-gray-500 mt-1">
          Be the first to share something with this group!
        </p>
      </div>
    );
  }

  /* ---------- GRID ---------- */
  return (
    <motion.div
      layout
      className="
        grid gap-4
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post._id}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="w-full"
          >
            <Post post={post} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

GroupPostFeed.propTypes = {
  groupId: PropTypes.string.isRequired,
};

export default GroupPostFeed;
