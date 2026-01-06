import { useSelector } from "react-redux";

export const useButtonText = () => {
  const { myFriends, requests, sentRequests } = useSelector(
    (state) => state.friends
  );

  return (targetUserId) => {
    if (!targetUserId) return "Follow";

    if (myFriends?.some(f => f._id === targetUserId)) {
      return "Message";
    }

    if (
      sentRequests?.some(
        r => r.to === targetUserId || r.to?._id === targetUserId
      )
    ) {
      return "Requested";
    }

    if (
      requests?.some(
        r => r.from === targetUserId || r.from?._id === targetUserId
      )
    ) {
      return "Accept";
    }

    return "Follow";
  };
};
