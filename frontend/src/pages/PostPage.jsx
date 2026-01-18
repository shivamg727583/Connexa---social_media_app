import PostSkeleton from "@/components/placeholders/PostSkeleton";
import Post from "@/components/posts/Post";
import { EmptyState } from "@/components/shared/PageLayout";
import { fetchPostById } from "@/features/post/postThunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

 const PostPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedPost, loading } = useSelector((state) => state.post);

  useEffect(() => {
    if (id) dispatch(fetchPostById(id));
  }, [id, dispatch]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-black py-4 sm:py-6 px-3">
      <div className="flex justify-center">
        {loading ? <PostSkeleton /> : selectedPost ? <Post post={selectedPost} isSinglePost /> : (
          <EmptyState title="Post not found" description="This post may have been deleted" />
        )}
      </div>
    </main>
  );
};


export default PostPage;