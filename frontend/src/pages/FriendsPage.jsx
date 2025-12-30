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
  const { userProfile, loading } = useSelector((state) => state.auth);
  const { friends, loading: friendsLoading } = useSelector((state) => state.friends);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchProfileById(id));
      dispatch(fetchFriends(id));
    }
  }, [dispatch, id]);

  const filteredFriends = useMemo(() => {
    if (!search.trim()) return friends;

    return friends.filter((f) =>
      f?.username?.toLowerCase().includes(search.toLowerCase())
    );
  }, [friends, search]);

  const isLoading = loading || friendsLoading;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-3xl mx-auto">
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
                {friends.length} {friends.length === 1 ? "friend" : "friends"}
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
              <p className="text-sm">
                {search
                  ? "Try a different search"
                  : "Start connecting with people"}
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <FriendRow key={friend._id} friend={friend} />
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FriendsPage;