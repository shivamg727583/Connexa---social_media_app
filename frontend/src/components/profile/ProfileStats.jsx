import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

const ProfileStats = ({ posts, friends, saved, isOwnProfile ,userId }) => (
  <div className="flex gap-6 sm:gap-8 text-center sm:text-left">
    <div>
      <p className="font-bold text-base sm:text-lg">{posts}</p>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Posts</p>
    </div>
    <div>
      <Link to={`/profile/${userId}/friends`}>
        <p className="font-bold text-base sm:text-lg">{friends}</p>
      </Link>
      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Friends</p>
    </div>
    {isOwnProfile && (
      <div>
        <p className="font-bold text-base sm:text-lg">{saved}</p>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Saved</p>
      </div>
    )}
  </div>
);

ProfileStats.propTypes = {
  posts: PropTypes.number.isRequired,
  friends: PropTypes.number.isRequired,
  saved: PropTypes.number.isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  userId: PropTypes.string.isRequired
};

export default ProfileStats