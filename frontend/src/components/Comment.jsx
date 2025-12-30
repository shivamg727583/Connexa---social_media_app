import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useFormatTime } from '@/hooks/useFormatTime';
import { Trash2 } from 'lucide-react';
import { deleteComment } from '@/features/post/postThunks';
import { Button } from './ui/button';
import PropTypes from 'prop-types';
const Comment = ({ comment: c }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { activePost } = useSelector((s) => s.post);
  const time = useFormatTime(c.createdAt);

  return (
    <div key={c._id} className="flex items-start gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={c.author?.profilePicture} />
        <AvatarFallback>{c.author?.username?.[0]}</AvatarFallback>
      </Avatar>
      <div className="bg-gray-100 dark:bg-neutral-800 rounded-xl px-3 py-2 text-sm max-w-[85%]">
        <span className="font-semibold mr-1">{c.author?.username}</span>
        {c.text}
        <span className="ml-1 text-xs text-gray-400">
          {time}

        </span>

      </div>
      {c.author?._id === user._id && (
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7 text-red-500"
          onClick={() =>
            dispatch(
              deleteComment({
                postId: activePost._id,
                commentId: c._id,
              })
            )
          }
        >
          <Trash2 size={12} />
        </Button>
      )}
    </div>
  )
}

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;
