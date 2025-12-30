import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

const SearchUserRow = ({ user }) => {
  return (
    <div className="
      flex items-center gap-4
      px-4 py-3
      hover:bg-gray-100 dark:hover:bg-neutral-900
      active:bg-gray-200 dark:active:bg-neutral-800
      transition
      rounded-xl
    ">
      <Avatar className="h-12 w-12">
        <AvatarImage src={user.profilePicture} />
        <AvatarFallback>
          {user.username[0]}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {user.username}
        </p>
        <p className="text-xs text-gray-400">
          View profile
        </p>
      </div>

      <Link to={`/profile/${user._id}`}>
        <Button
          size="sm"
          variant="secondary"
          className="rounded-full px-4"
        >
          View
        </Button>
      </Link>
    </div>
  );
};

SearchUserRow.propTypes = {
  user: PropTypes.object.isRequired,
};

export default SearchUserRow;
