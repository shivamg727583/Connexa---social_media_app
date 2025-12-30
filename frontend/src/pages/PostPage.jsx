import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Post from "@/components/Post";
import { fetchPostById } from "@/features/post/postThunks";

const PostSkeleton = () => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="flex-1 space-y-2">
          <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="w-16 h-2 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
      <div className="aspect-square bg-gray-300 dark:bg-gray-800" />
      <div className="p-4 space-y-3">
        <div className="w-20 h-3 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
};

function PostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPost, loading } = useSelector((state) => state.post);

  useEffect(() => {
    if (id) dispatch(fetchPostById(id));
  }, [id, dispatch]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-6 px-3">
      <div className="flex justify-center">
        {loading && <PostSkeleton />}

        {!loading && selectedPost && (
          <Post post={selectedPost} isSinglePost />
        )}
      </div>
    </main>
  );
}

export default PostPage;
