import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";

import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
} from "@/features/friends/friendThunks";
import PropTypes from "prop-types";


const SuggestedUserCard = ({ user }) => {
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
    <div className="min-w-[140px] bg-white border rounded-xl p-4 flex md:flex-row flex-col hover: items-center shadow-sm">
    <Link to={`/profile/${user._id}`}>
       <Avatar className="h-14 w-14 mb-2">
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>
          {user.username[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
      </Link>

      <h3 className="text-sm font-semibold truncate w-full text-center">
        {user.username}
      </h3>

      <button
        onClick={handleAction}
        className="mt-3 text-xs font-semibold text-blue-500"
      >
        {getButtonText(user._id)}
      </button>
    </div>
  );
};

SuggestedUserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SuggestedUserCard;
