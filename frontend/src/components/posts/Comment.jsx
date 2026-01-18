import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useFormatTime } from '@/hooks/useFormatTime';
import { deleteComment } from '@/features/post/postThunks';

const Comment = memo(({ comment: c }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { activePost } = useSelector((s) => s.post);
  const time = useFormatTime(c.createdAt);

  return (
    <div className="flex items-start gap-2 sm:gap-3">
      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
        <AvatarImage src={c.author?.profilePicture} />
        <AvatarFallback>{c.author?.username?.[0]}</AvatarFallback>
      </Avatar>
      
      <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm max-w-[85%] break-words">
        <span className="font-semibold mr-1">{c.author?.username}</span>
        {c.text}
        <span className="ml-1 text-xs text-gray-400">{time}</span>
      </div>

      {c.author?._id === user._id && (
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6 sm:h-7 sm:w-7 text-red-500 flex-shrink-0"
          onClick={() => dispatch(deleteComment({ postId: activePost._id, commentId: c._id }))}
        >
          <Trash2 size={12} />
        </Button>
      )}
    </div>
  );
});

Comment.displayName = 'Comment';
Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;