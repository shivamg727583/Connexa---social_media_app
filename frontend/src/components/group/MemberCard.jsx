import PropTypes from 'prop-types';

const MemberCard = ({ member, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-xl flex items-center gap-3 cursor-pointer shadow-sm hover:shadow-md transition"
  >
    <img
      src={member?.profilePicture || "/avatar.png"}
      alt={member?.username || "User"}
      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
    />
    <span className="font-medium truncate text-sm sm:text-base">
      {member?.username || "User"}
    </span>
  </div>
);

MemberCard.propTypes = {
  member: PropTypes.shape({
    profilePicture: PropTypes.string,
    username: PropTypes.string,
  }),
  onClick: PropTypes.func.isRequired,
};


export default MemberCard;