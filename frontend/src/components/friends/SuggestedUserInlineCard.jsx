import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";

import {
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
} from "@/features/friends/friendThunks";

const SuggestedUserInlineCard = ({ user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getFriendStatus = useFriendStatus();
  const getRequestId = useFriendRequestId();

  const status = getFriendStatus(user._id);

  const buttonMap = {
    follow: "Follow",
    requested: "Requested",
    accept: "Accept",
    friends: "Message",
  };

  const handleAction = () => {
    if (status === "follow") {
      dispatch(sendFriendRequest({ to: user._id }));
    }

    if (status === "requested") {
      dispatch(cancelFriendRequest({ to: user._id }));
    }

    if (status === "accept") {
      const requestId = getRequestId(user._id);

      if (requestId) {
        dispatch(acceptFriendRequest({ requestId }));
      }
    }

    if (status === "friends") {
      navigate(`/chat/${user._id}`);
    }
  };

  return (
    <div
      className="
        w-[170px]
        flex-shrink-0
        rounded-2xl
        border
        border-gray-200/80
        dark:border-white/10
        bg-white
        dark:bg-[#111111]
        p-4
        shadow-sm
      "
    >
      <div className="flex flex-col items-center text-center">
        <Link to={`/profile/${user._id}`}>
          <Avatar className="h-16 w-16 mb-3 ring-2 ring-gray-100 dark:ring-white/10">
            <AvatarImage src={user.profilePicture} />
            <AvatarFallback>
              {user.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>

        <Link to={`/profile/${user._id}`}>
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate max-w-full">
            {user.username}
          </h3>
        </Link>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Suggested for you
        </p>

        <button
          onClick={handleAction}
          className={`
            mt-4
            w-full
            rounded-xl
            py-2
            text-sm
            font-semibold
            transition-all
            duration-200
            
            ${
              status === "friends"
                ? `
                  bg-gray-100
                  dark:bg-white/10
                  text-gray-900
                  dark:text-white
                `
                : status === "requested"
                ? `
                  bg-gray-100
                  dark:bg-white/10
                  text-gray-700
                  dark:text-gray-300
                `
                : `
                  bg-gradient-to-r
                  from-purple-600
                  to-pink-600
                  text-white
                `
            }
          `}
        >
          {buttonMap[status]}
        </button>
      </div>
    </div>
  );
};

export default SuggestedUserInlineCard;