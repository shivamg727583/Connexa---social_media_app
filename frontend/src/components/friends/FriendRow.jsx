import { useEffect, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { fetchMutualFriends, sendFriendRequest } from "@/features/friends/friendThunks";
import { useButtonText } from "@/hooks/useButtonText";

const FriendRow = memo(({ friend, isFriend, isYou }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friendStatus = useButtonText(friend._id);
  const mutual = useSelector((s) => s.friends.mutualFriends[friend._id]);

  useEffect(() => {
    if (!isYou && !mutual) {
      dispatch(fetchMutualFriends(friend._id));
    }
  }, [dispatch, friend._id, mutual, isYou]);

  return (
    <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors">
      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
        <AvatarImage src={friend.profilePicture} />
        <AvatarFallback>{friend.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate text-sm sm:text-base">
          {isYou ? "You" : friend.username}
        </p>

        {!isYou && mutual?.count > 0 && (
          <p className="text-xs text-gray-400">
            {mutual.count} mutual friend{mutual.count > 1 && "s"}
          </p>
        )}
      </div>

      {!isYou && (
        <div className="flex gap-2">
          {isFriend ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/chat/${friend._id}`)}
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
            >
              <MessageCircle size={14} className="sm:w-4 sm:h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => dispatch(sendFriendRequest({ to: friend._id }))}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
            >
              <UserPlus size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{friendStatus}</span>
            </Button>
          )}

          <Link to={`/profile/${friend._id}`}>
            <Button size="sm" className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm">
              View
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
});

FriendRow.displayName = "FriendRow";
FriendRow.propTypes = {
  friend: PropTypes.object.isRequired,
  isFriend: PropTypes.bool.isRequired,
  isYou: PropTypes.bool.isRequired,
};

export default FriendRow;