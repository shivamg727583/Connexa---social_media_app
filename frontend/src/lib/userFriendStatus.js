import { useSelector } from "react-redux";

export const useFriendStatus = () => {
  const { myFriends, requests, sentRequests } = useSelector(
    (state) => state.friends
  );

  return (targetUserId) => {
    if (!targetUserId) return "follow";

    if (myFriends?.some(f => f._id === targetUserId)) {
      return "friends";
    }

    if (
      sentRequests?.some(
        r => r.to === targetUserId || r.to?._id === targetUserId
      )
    ){
      return "requested";
    }

    if (
      requests?.some(
        r => r.from === targetUserId || r.from?._id === targetUserId
      )
    ) {
      return "accept";
    }

    return "follow";
  };
};

