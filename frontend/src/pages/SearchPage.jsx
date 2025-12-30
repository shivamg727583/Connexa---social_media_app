import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search,  UserPlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import SearchUserRow from "@/components/SearchUserRow";
import { searchUsers } from "@/features/search/searchThunks";
import { clearSearch } from "@/features/search/searchSlice";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch());
      return;
    }

    const delay = setTimeout(() => {
      dispatch(searchUsers(query));
    }, 400);

    return () => clearTimeout(delay);
  }, [query, dispatch]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-950"
    >
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-20 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900 border-none focus-visible:ring-2 focus-visible:ring-purple-500"
            />
          </div>
        </div>

        <div className="px-4 py-6">
          {loading && (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl animate-pulse"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !query && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full flex items-center justify-center mb-6">
                <UserPlus className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Discover New Friends
              </h3>
              <p className="text-sm text-gray-400">
                Search for people to connect with
              </p>
            </div>
          )}

          {!loading && query && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search className="w-16 h-16 mb-4 opacity-40" />
              <p className="text-lg font-medium">No users found</p>
              <p className="text-sm">Try searching with a different name</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="space-y-2">
              {users.map((user) => (
                <SearchUserRow key={user._id} user={user} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};


export default SearchPage;