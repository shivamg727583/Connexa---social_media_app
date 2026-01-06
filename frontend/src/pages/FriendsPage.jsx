import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { useParams } from "react-router-dom";

import { Input } from "@/components/ui/input";
import FriendRow from "@/components/FriendRow";
import { fetchProfileById } from "@/features/auth/authThunks";
import { fetchFriends } from "@/features/friends/friendThunks";

const FriendsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const { user, userProfile, loading } = useSelector((s) => s.auth);
  const {
    myFriends,
    profileFriends,
    loading: friendsLoading,
  } = useSelector((s) => s.friends);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?._id || !id) return;

    dispatch(fetchProfileById(id));

    dispatch(fetchFriends({ userId: user._id, isMe: true }));
    dispatch(fetchFriends({ userId: id, isMe: false }));
  }, [dispatch, id, user?._id]);

  const myFriendIds = useMemo(
    () => myFriends.map((f) => f._id),
    [myFriends]
  );

  const listToShow = profileFriends;

  const processedFriends = useMemo(() => {
    if (!user || !listToShow.length) return listToShow;

    const you = listToShow.find((f) => f._id === user._id);
    const others = listToShow.filter((f) => f._id !== user._id);

    return you ? [{ ...you, isYou: true }, ...others] : others;
  }, [listToShow, user]);

 
  const filteredFriends = useMemo(() => {
    if (!search.trim()) return processedFriends;

    return processedFriends.filter((f) =>
      f.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [processedFriends, search]);

  const isLoading = loading || friendsLoading;

  console.log({listToShow,filteredFriends,processedFriends})

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl">
                {userProfile?.username}&apos;s Friends
              </h1>
              <p className="text-sm text-gray-500">
                {profileFriends.length}{" "}
                {profileFriends.length === 1 ? "friend" : "friends"}
              </p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-gray-100 dark:bg-gray-900 border-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Users className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">
                {search ? "No friends found" : "No friends yet"}
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => {
              const isYou = friend._id === user._id;
              const isFriend = myFriendIds.includes(friend._id);

              return (
                <FriendRow
                  key={friend._id}
                  friend={friend}
                  isFriend={isFriend}
                  isYou={isYou}
                />
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FriendsPage;
