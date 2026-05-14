import { useSelector } from "react-redux";

export const useFriendStatus = () => {
  const { user } = useSelector((state) => state.auth);

  const { requests, sentRequests } = useSelector(
    (state) => state.friends
  );

  return (targetUserId) => {
    if (!targetUserId) return "follow";


    const isFriend = user?.friends?.some(
      (friendId) => String(friendId) === String(targetUserId)
    );

    if (isFriend) {
      return "friends";
    }

    // SENT REQUEST
    const hasSentRequest = sentRequests?.some(
      (request) =>
        String(request?.to?._id || request?.to) === String(targetUserId)
    );

    if (hasSentRequest) {
      return "requested";
    }

    // RECEIVED REQUEST
    const hasReceivedRequest = requests?.some(
      (request) =>
        String(request?.from?._id || request?.from) === String(targetUserId)
    );

    if (hasReceivedRequest) {
      return "accept";
    }

    return "follow";
  };
};