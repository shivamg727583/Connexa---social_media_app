import { useSelector } from "react-redux";

export const useButtonText = () => {
  const { user } = useSelector((state) => state.auth);

  const { requests, sentRequests } = useSelector(
    (state) => state.friends
  );

  return (targetUserId) => {
    if (!targetUserId) return "Follow";

    // FRIENDS
    const isFriend = user?.friends?.some(
      (friendId) => String(friendId) === String(targetUserId)
    );

    if (isFriend) {
      return "Message";
    }

    // SENT REQUEST
    const hasSentRequest = sentRequests?.some(
      (request) =>
        String(request?.to?._id || request?.to) === String(targetUserId)
    );

    if (hasSentRequest) {
      return "Requested";
    }

    // RECEIVED REQUEST
    const hasReceivedRequest = requests?.some(
      (request) =>
        String(request?.from?._id || request?.from) === String(targetUserId)
    );

    if (hasReceivedRequest) {
      return "Accept";
    }

    return "Follow";
  };
};