import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, UserPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchUserRow from "@/components/friends/SearchUserRow";
import { searchUsers } from "@/features/search/searchThunks";
import { clearSearch } from "@/features/search/searchSlice";
import { PageContainer, PageHeader, ContentWrapper, EmptyState } from "@/components/shared/PageLayout";
import SearchSkeleton from "@/components/placeholders/SearchSkeleton";


 const SearchPage = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (!query.trim()) {
      dispatch(clearSearch());
      return;
    }

    const delay = setTimeout(() => dispatch(searchUsers(query)), 400);
    return () => clearTimeout(delay);
  }, [query, dispatch]);

  return (
    <PageContainer>
      <PageHeader
        title="Search"
        subtitle="Discover new connections"
        icon={Search}
      />

      <ContentWrapper maxWidth="2xl">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 pb-4">
          <div className="relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              placeholder="Search people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 sm:pl-12 h-11 sm:h-12 rounded-full bg-gray-100 dark:bg-gray-900 border-none focus-visible:ring-2 focus-visible:ring-purple-500 text-sm sm:text-base"
            />
          </div>
        </div>

        {loading ? (
          <SearchSkeleton />
        ) : !query ? (
          <EmptyState
            icon={UserPlus}
            title="Discover New Friends"
            description="Search for people to connect with"
          />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No users found"
            description="Try searching with a different name"
          />
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <SearchUserRow key={user._id} user={user} />
            ))}
          </div>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SearchPage;