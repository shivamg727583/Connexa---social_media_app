import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { fetchMutualFriends } from "@/features/friends/friendThunks";

const FriendRow = ({ friend }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutual = useSelector(
    (s) => s.friends.mutualFriends[friend._id]
  );

  useEffect(() => {
    if (!mutual) {
      dispatch(fetchMutualFriends(friend._id));
    }
  }, [dispatch, friend._id, mutual]);

  return (
    <div className="
      flex items-center gap-4
      px-4 py-3
      hover:bg-gray-100 dark:hover:bg-neutral-900
      transition
    ">
      
      <Avatar className="h-12 w-12">
        <AvatarImage src={friend?.profilePicture} />
        <AvatarFallback>{friend?.username}</AvatarFallback>
      </Avatar>

      
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{friend.username}</p>

        {mutual?.count > 0 && (
          <p className="text-xs text-gray-400 truncate">
            {mutual.count} mutual friend{mutual.count > 1 && "s"}
          </p>
        )}
      </div>

     
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate(`/chat/${friend._id}`)}
        >
          <MessageCircle size={16} />
        </Button>

        <Link to={`/profile/${friend._id}`}>
          <Button size="sm">View</Button>
        </Link>
      </div>
    </div>
  );
};

FriendRow.propTypes = {
  friend: PropTypes.object.isRequired,
};

export default FriendRow;
