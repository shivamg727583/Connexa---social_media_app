import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const SearchUserRow = ({ user }) => (
  <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-100 dark:hover:bg-neutral-900 active:bg-gray-200 dark:active:bg-neutral-800 transition rounded-xl">
    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
      <AvatarImage src={user.profilePicture} />
      <AvatarFallback>{user.username[0]}</AvatarFallback>
    </Avatar>

    <div className="flex-1 min-w-0">
      <p className="font-medium truncate text-sm sm:text-base">{user.username}</p>
      <p className="text-xs text-gray-400">View profile</p>
    </div>

    <Link to={`/profile/${user._id}`}>
      <Button size="sm" variant="secondary" className="rounded-full px-3 sm:px-4 text-xs sm:text-sm">
        View
      </Button>
    </Link>
  </div>
);

SearchUserRow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SearchUserRow;