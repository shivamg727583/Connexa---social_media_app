import { motion } from "framer-motion";
import PropTypes from "prop-types";

const JoinRequestCard = ({ user, onApprove, onReject }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm"
    >
      <div className="flex items-center gap-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="font-medium">{user.username}</span>
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onApprove}
          className="px-3 py-1 rounded-lg bg-green-500 text-white"
        >
          Approve
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onReject}
          className="px-3 py-1 rounded-lg bg-red-500 text-white"
        >
          Reject
        </motion.button>
      </div>
    </motion.div>
  );
};

JoinRequestCard.propTypes = {
  user: PropTypes.object.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default JoinRequestCard;
