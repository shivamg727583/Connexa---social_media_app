import { useSelector } from "react-redux";

import SuggestedUserCard from "@/components/friends/SuggestedUserCard";

import {
  PageContainer,
  ContentWrapper,
  EmptyState,
} from "@/components/shared/PageLayout";

const SuggestedUsersPage = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <PageContainer>
      <ContentWrapper maxWidth="3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Suggested for you
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Discover people you may know and connect with.
          </p>
        </div>

        {suggestedUsers.length === 0 ? (
          <EmptyState
            title="No suggestions available"
            description="We'll show new people here when available."
          />
        ) : (
          <div className="grid gap-4">
            {suggestedUsers.map((user) => (
              <SuggestedUserCard
                key={user._id}
                user={user}
              />
            ))}
          </div>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SuggestedUsersPage;