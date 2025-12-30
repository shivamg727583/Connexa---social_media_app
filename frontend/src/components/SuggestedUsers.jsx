import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useButtonText } from "@/hooks/useButtonText";
import { useFriendStatus } from "@/lib/userFriendStatus";
import { useFriendRequestId } from "@/lib/userFriendReqId";

import {
  sendFriendRequest,
  acceptFriendRequest,
  cancelFriendRequest,
} from "@/features/friends/friendThunks";

const SuggestedUsers = () => {
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
        if (requestId) {
          dispatch(acceptFriendRequest({ requestId }));
        }
        break;
      }

      case "friends":
        navigate(`/chat/${user._id}`);
        break;

      default:
        break;
    }
  };

  if (!suggestedUsers || suggestedUsers.length === 0) {
    return null;
  }

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm mb-4">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer hover:text-gray-800 transition-colors">
          See All
        </span>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link to={`/profile/${user._id}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="flex-1 min-w-0">
                <Link to={`/profile/${user._id}`}>
                  <h1 className="font-semibold text-sm truncate hover:underline">
                    {user.username}
                  </h1>
                </Link>
                <span className="text-gray-600 text-xs truncate block">
                  {user.bio || "Bio here..."}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleFriendAction(user)}
              className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6] transition-colors whitespace-nowrap ml-2"
            >
              {getButtonText(user._id)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;