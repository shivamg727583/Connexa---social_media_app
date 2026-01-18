import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest } from "@/features/friends/friendThunks";

const SuggestedUsers = memo(() => {
  const { suggestedUsers } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getButtonText = useButtonText();
  const getFriendStatus = useFriendStatus();
  const getRequestId = useFriendRequestId();

  const handleFriendAction = (user) => {
    const status = getFriendStatus(user._id);

    switch (status) {
      case "follow":
        dispatch(sendFriendRequest({ to: user._id }));
        break;
      case "requested":
        dispatch(cancelFriendRequest({ to: user._id }));
        break;
      case "accept": {
        const requestId = getRequestId(user._id);
        if (requestId) dispatch(acceptFriendRequest({ requestId }));
        break;
      }
      case "friends":
        navigate(`/chat/${user._id}`);
        break;
      default:
        break;
    }
  };

  if (!suggestedUsers?.length) return null;

  return (
    <div className="my-6 sm:my-10">
      <div className="flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4">
        <h1 className="font-semibold text-gray-600 dark:text-gray-400">Suggested for you</h1>
        <Link to="/suggested" className="font-medium cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
          See All
        </Link>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user._id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Link to={`/profile/${user._id}`}>
                <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user._id}`}>
                  <h1 className="font-semibold text-xs sm:text-sm truncate hover:underline">
                    {user.username}
                  </h1>
                </Link>
                <span className="text-gray-600 dark:text-gray-400 text-xs truncate block">
                  {user.bio || "Bio here..."}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleFriendAction(user)}
              className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] transition-colors whitespace-nowrap flex-shrink-0"
            >
              {getButtonText(user._id)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
});

SuggestedUsers.displayName = "SuggestedUsers";

export default SuggestedUsers;