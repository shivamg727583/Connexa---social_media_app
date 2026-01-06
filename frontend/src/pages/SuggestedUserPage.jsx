import SuggestedUserCard from "@/components/SuggestedUserCard";
import { useSelector } from "react-redux";


const SuggestedUsersPage = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-lg font-semibold mb-4">
        Suggested Users
      </h1>

      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsersPage;
