import { motion } from "framer-motion";
import Posts from "./Posts";

const Feed = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="
        w-full
        flex flex-col items-center
        px-2 sm:px-6 lg:px-0
        py-6
      "
    >
      <Posts />
    </motion.div>
  );
};

export default Feed;
