import { useSelector } from "react-redux";

export const useButtonText = () => {
  const { friends, requests, sentRequests } = useSelector(
    (state) => state.friends
  );


  const getButtonText = (targetUserId) => {
    if (friends?.some(f => f?._id.toString() === targetUserId)) {
      return "Message";
    }

    if (sentRequests?.some( r => r.to === targetUserId || r.to?._id === targetUserId)) {
      return "Requested";
    }

    if (requests?.some(r => r.from === targetUserId || r.from?._id === targetUserId)) {
      return "Accept";
    }

    return "Follow";
  };

  return getButtonText;
};
