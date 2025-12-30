import { useSelector } from "react-redux";

export const useFriendRequestId = () => {
  const { requests } = useSelector(state => state.friends);

  return (fromUserId) => {
    const req = requests.find(
      r => r.from === fromUserId || r.from?._id === fromUserId
    );
    return req?._id;
  };
};
