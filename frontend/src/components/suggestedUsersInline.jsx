import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUserCard from "./SuggestedUserCard";

const SuggestedUsersInline = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  if (!suggestedUsers?.length) return null;

  return (
    <div className="xl:hidden bg-white border rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold">
          Suggested for you
        </h2>

        <Link
          to="/suggested"
          className="text-xs font-medium text-blue-500"
        >
          View all
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {suggestedUsers.slice(0, 6).map((user) => (
          <SuggestedUserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsersInline;
