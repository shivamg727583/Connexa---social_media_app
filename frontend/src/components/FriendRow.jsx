import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  fetchMutualFriends,
  sendFriendRequest,
} from "@/features/friends/friendThunks";
import { useButtonText } from "@/hooks/useButtonText";

const FriendRow = ({ friend, isFriend, isYou }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const friendStatus = useButtonText(friend._id);

  const mutual = useSelector(
    (s) => s.friends.mutualFriends[friend._id]
  );

  useEffect(() => {
    if (!isYou && !mutual) {
      dispatch(fetchMutualFriends(friend._id));
    }
  }, [dispatch, friend._id, mutual, isYou]);

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-neutral-900">
      <Avatar className="h-12 w-12">
        <AvatarImage src={friend.profilePicture} />
        <AvatarFallback>
          {friend.username[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
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
            >
              <MessageCircle size={16} />
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                dispatch(sendFriendRequest({ to: friend._id }))
              }
            >
              <UserPlus size={16} />
              {friendStatus}
            </Button>
          )}

          <Link to={`/profile/${friend._id}`}>
            <Button size="sm">View</Button>
          </Link>
        </div>
      )}
    </div>
  );
};


FriendRow.propTypes = {
  friend: PropTypes.object.isRequired,
  isFriend: PropTypes.bool.isRequired,
  isYou: PropTypes.bool.isRequired,
};

export default FriendRow;
