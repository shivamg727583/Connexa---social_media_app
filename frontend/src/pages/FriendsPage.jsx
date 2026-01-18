import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Search,  Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import FriendRow from "@/components/friends/FriendRow";
import { fetchProfileById } from "@/features/auth/authThunks";
import { fetchFriends } from "@/features/friends/friendThunks";
import { PageContainer, PageHeader, ContentWrapper, LoadingSpinner, EmptyState } from "@/components/shared/PageLayout";



const FriendsPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { user, userProfile, loading } = useSelector((s) => s.auth);
  const { myFriends, profileFriends, loading: friendsLoading } = useSelector((s) => s.friends);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?._id || !id) return;

    dispatch(fetchProfileById(id));
    dispatch(fetchFriends({ userId: user._id, isMe: true }));
    dispatch(fetchFriends({ userId: id, isMe: false }));
  }, [dispatch, id, user?._id]);

  const myFriendIds = useMemo(() => myFriends.map((f) => f._id), [myFriends]);

  const processedFriends = useMemo(() => {
    if (!user || !profileFriends.length) return profileFriends;

    const you = profileFriends.find((f) => f._id === user._id);
    const others = profileFriends.filter((f) => f._id !== user._id);

    return you ? [{ ...you, isYou: true }, ...others] : others;
  }, [profileFriends, user]);

  const filteredFriends = useMemo(
    () => search.trim()
      ? processedFriends.filter((f) => f.username.toLowerCase().includes(search.toLowerCase()))
      : processedFriends,
    [processedFriends, search]
  );

  const isLoading = loading || friendsLoading;

  return (
    <PageContainer>
      <PageHeader
        title={`${userProfile?.username}'s Friends`}
        subtitle={`${profileFriends.length} ${profileFriends.length === 1 ? "friend" : "friends"}`}
        icon={Users}
      />

      <ContentWrapper maxWidth="3xl">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              placeholder="Search friends..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 sm:pl-10 h-10 sm:h-11 rounded-xl bg-gray-100 dark:bg-gray-900 border-none text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredFriends.length === 0 ? (
            <EmptyState
              icon={Users}
              title={search ? "No friends found" : "No friends yet"}
            />
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
      </ContentWrapper>
    </PageContainer>
  );
};


export default FriendsPage;