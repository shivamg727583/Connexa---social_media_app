import { memo } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";

import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
} from "@/features/friends/friendThunks";

const SuggestedUserCard = memo(({ user }) => {
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
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-gray-200/70
        dark:border-white/10
        bg-white/80
        dark:bg-[#111111]
        backdrop-blur-xl
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
      "
    >
      <div className="p-5">
        <div className="flex items-center gap-4">
          <Link to={`/profile/${user._id}`}>
            <Avatar className="h-16 w-16 ring-2 ring-gray-100 dark:ring-white/10">
              <AvatarImage src={user.profilePicture} />
              <AvatarFallback className="text-lg font-semibold">
                {user.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <Link to={`/profile/${user._id}`}>
              <h3 className="font-semibold text-[15px] text-gray-900 dark:text-white truncate hover:underline">
                {user.username}
              </h3>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              Suggested for you
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Followed by people you may know
            </p>
          </div>

          <button
            onClick={handleAction}
            className={`
              px-4
              py-2
              rounded-xl
              text-sm
              font-semibold
              transition-all
              duration-200
              active:scale-95
              
              ${
                status === "friends"
                  ? `
                    bg-gray-100
                    dark:bg-white/10
                    text-gray-900
                    dark:text-white
                    hover:bg-gray-200
                    dark:hover:bg-white/20
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
                    hover:from-purple-700
                    hover:to-pink-700
                    text-white
                    shadow-lg
                    shadow-purple-500/20
                  `
              }
            `}
          >
            {buttonMap[status]}
          </button>
        </div>
      </div>
    </motion.div>
  );
});

SuggestedUserCard.displayName = "SuggestedUserCard";

SuggestedUserCard.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SuggestedUserCard;