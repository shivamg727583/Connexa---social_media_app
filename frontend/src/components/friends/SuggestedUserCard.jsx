import { memo } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } from "@/features/friends/friendThunks";

const SuggestedUserCard = memo(({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getButtonText = useButtonText();
  const getFriendStatus = useFriendStatus();
  const getRequestId = useFriendRequestId();

  const handleAction = () => {
    const status = getFriendStatus(user._id);

    if (status === "follow") {
      dispatch(sendFriendRequest({ to: user._id }));
    }

    if (status === "requested") {
      dispatch(cancelFriendRequest({ to: user._id }));
    }

    if (status === "accept") {
      const requestId = getRequestId(user._id);
      requestId && dispatch(acceptFriendRequest({ requestId }));
    }

    if (status === "friends") {
      navigate(`/chat/${user._id}`);
    }
  };

  return (
    <div className="min-w-[130px] sm:min-w-[140px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/profile/${user._id}`}>
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14 mb-2">
          <AvatarImage src={user.profilePicture} />
          <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </Link>

      <h3 className="text-xs sm:text-sm font-semibold truncate w-full text-center mb-2">
        {user.username}
      </h3>

      <button
        onClick={handleAction}
        className="mt-1 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
      >
        {getButtonText(user._id)}
      </button>
    </div>
  );
});

SuggestedUserCard.displayName = "SuggestedUserCard";
SuggestedUserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SuggestedUserCard;