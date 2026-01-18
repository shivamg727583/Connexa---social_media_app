import { memo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUserCard from "@/components/friends/SuggestedUserCard";


const SuggestedUsersInline = memo(() => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  if (!suggestedUsers?.length) return null;

  return (
    <div className="xl:hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 sm:p-4 my-4 sm:my-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">Suggested for you</h2>
        <Link to="/suggested" className="text-xs font-medium text-blue-500 hover:text-blue-600">
          View all
        </Link>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {suggestedUsers.slice(0, 6).map((user) => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
});

SuggestedUsersInline.displayName = "SuggestedUsersInline";

export default SuggestedUsersInline;