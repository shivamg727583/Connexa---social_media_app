import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) return null; 

  return (
    <aside className="w-72 my-10 pr-8 flex flex-col gap-6">
      <Link
        to={`/profile/${user?._id}`}
        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition"
      >
        <Avatar>
          <AvatarImage src={user?.profilePicture} alt="Profile picture" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h1 className="font-semibold text-sm">{user?.username}</h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </Link>

      <SuggestedUsers />
    </aside>
  );
};

export default RightSidebar;
