import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { lazy, Suspense } from "react";


const SuggestedUsers = lazy(() => import("@/components/friends/SuggestedUsers"));


 const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);

  if (!user) return null;

  return (
    <aside className="w-60 lg:w-72 my-6 lg:my-10 pr-4 lg:pr-8 hidden lg:flex flex-col gap-4 lg:gap-6 sticky top-6">
      <Link
        to={`/profile/${user?._id}`}
        className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition"
      >
        <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
          <AvatarImage src={user?.profilePicture} alt="Profile picture" />
          <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <h1 className="font-semibold text-sm truncate">{user?.username}</h1>
          <span className="text-gray-600 dark:text-gray-400 text-xs truncate">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </Link>

      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg" />}>
        <SuggestedUsers />
      </Suspense>
    </aside>
  );
};


export default RightSidebar;
