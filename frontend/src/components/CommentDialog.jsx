import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Send,  Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

import { addComment } from "@/features/post/postThunks";
import Comment from "./Comment";
import PropTypes from 'prop-types';


const CommentDialog = ({ open, setOpen, post }) => {
  const dispatch = useDispatch();

  const { loading } = useSelector((s) => s.post);

  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  
  const updatedPost = useSelector((s) =>
    s.post.posts.find((p) => p._id === post?._id)
  );

  const activePost = updatedPost || post;
  const comments = activePost?.comments || [];

  useEffect(() => {
    if (!open) {
      setText("");
      setShowEmoji(false);
    }
  }, [open]);

  const submitHandler = () => {
    if (!text.trim() || !activePost?._id) return;
    dispatch(
      addComment({
        postId: activePost._id,
        text: text.trim(),
      })
    );
    setText("");
    setShowEmoji(false);
  };

  if (!activePost) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:w-[90vw] lg:w-[80vw] xl:w-[70vw] max-w-[1200px] p-0 overflow-hidden rounded-2xl shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Post comments</DialogTitle>
          <DialogDescription>View and add comments on this post</DialogDescription>
        </VisuallyHidden>

        <div className="flex flex-col lg:flex-row min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] max-h-[90vh]">
          <div className="lg:w-1/2 bg-black flex items-center justify-center">
            <img src={activePost.image} alt="post" className="w-full h-full object-contain max-h-[45vh] lg:max-h-full" />
          </div>

          <div className="flex flex-col lg:w-1/2 bg-white dark:bg-neutral-950">
            <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-neutral-800">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activePost.author?.profilePicture} />
                <AvatarFallback>{activePost.author?.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{activePost.author?.username}</span>
                <span className="text-xs text-gray-500">Comments</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50 dark:bg-neutral-900">
              {comments.length ? (
                comments.map((c) => (
                  <Comment key={c._id} comment={c} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                  <span>No comments yet</span>
                  <span className="text-xs">Be the first to comment ✨</span>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-neutral-950 border-t dark:border-neutral-800 px-3 py-2 flex items-center gap-2">
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-full"
                onKeyDown={(e) => e.key === "Enter" && submitHandler()}
              />
              <div className="relative">
                <Button size="icon" variant="ghost" onClick={() => setShowEmoji((p) => !p)}>
                  <Smile size={18} />
                </Button>
                {showEmoji && (
                  <div className="absolute bottom-12 right-0 z-50">
                    <EmojiPicker theme="auto" onEmojiClick={(e) => setText((t) => t + e.emoji)} />
                  </div>
                )}
              </div>
              <Button size="icon" className="rounded-full" disabled={!text.trim() || loading} onClick={submitHandler}>
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CommentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};

export default CommentDialog;