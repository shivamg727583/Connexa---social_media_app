 import SuggestedUserCard from "@/components/friends/SuggestedUserCard";
import { PageContainer, ContentWrapper, EmptyState } from "@/components/shared/PageLayout";
import { useSelector } from "react-redux";
 
 
 const SuggestedUsersPage = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <PageContainer>
      <ContentWrapper maxWidth="2xl">
        <h1 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 px-3 sm:px-0">
          Suggested Users
        </h1>

        {suggestedUsers.length === 0 ? (
          <EmptyState
            title="No suggestions"
            description="Check back later for new suggestions"
          />
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {suggestedUsers.map((user) => (
              <SuggestedUserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

export default SuggestedUsersPage;