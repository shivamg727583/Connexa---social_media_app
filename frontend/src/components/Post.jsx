import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import CommentDialog from "./CommentDialog";
import { likePost, unlikePost } from "@/features/post/postThunks";
import { useFormatTime } from "@/hooks/useFormatTime";

import PropTypes from 'prop-types';
const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const reduxPost = useSelector((state) =>
    state.post.posts.find((p) => p._id === post._id)
  );

  const activePost = reduxPost || post;
  const likes = activePost.likes || [];
  const comments = activePost.comments || [];
  const isLiked = likes.includes(user?._id);
  const isAuthor = activePost.author?._id === user?._id;

  const handleLike = () => {
    if (isLiked) {
      dispatch(unlikePost(activePost._id));
    } else {
      dispatch(likePost(activePost._id));
    }
  };

  const createAtTime = useFormatTime(activePost?.createdAt);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to={`/profile/${activePost.author?._id}`}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="w-10 h-10 ring-2 ring-gray-100 dark:ring-gray-800">
              <AvatarImage src={activePost.author?.profilePicture} />
              <AvatarFallback>
                {activePost.author?.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {activePost.author?.username}
              </span>
              <span className="text-xs text-gray-500">
                {createAtTime}
              </span>
            </div>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthor ? (
                <>
                  <DropdownMenuItem>Edit post</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Delete post
                  </DropdownMenuItem>
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
          <img
            src={activePost.image}
            alt="Post"
            className="w-full h-full object-contain"
            loading="lazy"
          />
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 1.2 }}
                onClick={handleLike}
                className="hover:opacity-70 transition-opacity"
              >
                <Heart
                  className={`w-6 h-6 ${isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700 dark:text-gray-300"
                    }`}
                />
              </motion.button>

              <motion.button
                whileTap={{ scale: 1.1 }}
                onClick={() => setCommentDialogOpen(true)}
                className="hover:opacity-70 transition-opacity"
              >
                <MessageCircle className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 1.1 }}
              className="hover:opacity-70 transition-opacity"
            >
              <Bookmark className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-sm">
              {likes.length} {likes.length === 1 ? "like" : "likes"}
            </p>

            {activePost.caption && (
              <p className="text-sm">
                <Link
                  to={`/profile/${activePost.author?._id}`}
                  className="font-semibold hover:underline mr-2"
                >
                  {activePost.author?.username}
                </Link>
                <span className="text-gray-700 dark:text-gray-300">
                  {activePost.caption}
                </span>
              </p>
            )}

            {comments.length > 0 && (
              <button
                onClick={() => setCommentDialogOpen(true)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                View all {comments.length} comments
              </button>
            )}
          </div>
        </div>
      </motion.article>

      {commentDialogOpen && (
        <CommentDialog
          open={commentDialogOpen}
          setOpen={setCommentDialogOpen}
          post={activePost}
        />
      )}
    </>
  );
};

export default Post;

Post.propTypes = {
  post: PropTypes.object.isRequired,
};