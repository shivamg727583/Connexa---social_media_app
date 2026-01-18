import { useState, useMemo, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CommentDialog from "@/components/posts/CommentDialog";
import {
  toggleLikePost,
  toggleSavePost,
} from "@/features/post/postThunks";
import { useFormatTime } from "@/hooks/useFormatTime";

import PropTypes from "prop-types";

const Post = memo(({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const reduxPost = useSelector((state) =>
    state.post.posts.find((p) => p._id === post._id)
  );

  const activePost = reduxPost || post;

  const isLiked = useMemo(
    () => activePost.likes?.includes(user?._id),
    [activePost.likes, user?._id]
  );

  const isSaved = useMemo(() => {
    if (typeof activePost.isSaved === 'boolean') return activePost.isSaved;
    return user?.savedPosts?.includes(activePost._id) || false;
  }, [activePost.isSaved, activePost._id, user?.savedPosts]);

  const { _id, author, image, caption, likes = [], comments = [], createdAt } = activePost;
  const isAuthor = author?._id === user?._id;
  const createdAtTime = useFormatTime(createdAt);

  const likeCountText = useMemo(
    () => `${likes.length} ${likes.length === 1 ? "like" : "likes"}`,
    [likes.length]
  );

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between px-3 sm:px-4 py-3">
          <Link to={`/profile/${author?._id}`} className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity">
            <Avatar className="w-9 h-9 sm:w-10 sm:h-10 ring-2 ring-gray-100 dark:ring-gray-800">
              <AvatarImage src={author?.profilePicture} />
              <AvatarFallback>{author?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-xs sm:text-sm">{author?.username}</span>
              <span className="text-xs text-gray-500">{createdAtTime}</span>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor ? (
                <>
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Delete post</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                  <DropdownMenuItem>Unfollow</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="relative w-full bg-black aspect-square">
          <img src={image} alt="Post" className="w-full h-full object-contain" loading="lazy" />
        </div>

        <div className="px-3 sm:px-4 py-3 space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={() => dispatch(toggleLikePost(_id))}
                className="hover:opacity-70 transition-opacity"
              >
                <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-300"}`} />
              </motion.button>

              <motion.button whileTap={{ scale: 1.1 }} onClick={() => setCommentDialogOpen(true)} className="hover:opacity-70 transition-opacity">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>

            <motion.button whileTap={{ scale: 1.1 }} onClick={() => dispatch(toggleSavePost(_id))} className="hover:opacity-70 transition-opacity">
              <Bookmark className={`w-5 h-5 sm:w-6 sm:h-6 transition-all ${isSaved ? "fill-black text-black dark:fill-white dark:text-white" : "text-gray-700 dark:text-gray-300"}`} />
            </motion.button>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-xs sm:text-sm">{likeCountText}</p>

            {caption && (
              <p className="text-xs sm:text-sm">
                <Link to={`/profile/${author?._id}`} className="font-semibold hover:underline mr-2">{author?.username}</Link>
                <span className="text-gray-700 dark:text-gray-300">{caption}</span>
              </p>
            )}

            {comments.length > 0 && (
              <button onClick={() => setCommentDialogOpen(true)} className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                View all {comments.length} comments
              </button>
            )}
          </div>
        </div>
      </motion.article>

      {commentDialogOpen && <CommentDialog open={commentDialogOpen} setOpen={setCommentDialogOpen} post={activePost} />}
    </>
  );
});

Post.displayName = "Post";
Post.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    author: PropTypes.object,
    image: PropTypes.string,
    caption: PropTypes.string,
    likes: PropTypes.array,
    comments: PropTypes.array,
    createdAt: PropTypes.string,
    isSaved: PropTypes.bool,
  }).isRequired,
};

export default Post;