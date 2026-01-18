import  { formatTime } from "@/lib/formatTime"
import PropTypes from 'prop-types';
import { motion } from "framer-motion";


const MessageBubble = ({ msg, isMine }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
  >
    <div
      className={`px-3 sm:px-4 py-2 rounded-2xl max-w-[75%] sm:max-w-[70%] ${
        isMine
          ? "bg-blue-600 text-white"
          : "bg-gray-200 dark:bg-gray-800"
      }`}
    >
      <p className="text-sm sm:text-base break-words">{msg.message}</p>
      <div className="text-xs mt-1 text-right opacity-70">
        {isMine && formatTime(msg.createdAt)}
      </div>
    </div>
  </motion.div>
);

MessageBubble.propTypes = {
  msg: PropTypes.shape({
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  isMine: PropTypes.bool.isRequired,
};

export default MessageBubble;