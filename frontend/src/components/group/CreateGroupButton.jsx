import { useState } from "react";
import CreateGroupModal from "@/components/modals/CreateGroupModal";
import { motion, AnimatePresence } from "framer-motion";

const CreateGroupButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className=" bg-gray-200 md:px-5 md:py-3 px-3 py-2 text-xs md:text-base rounded-full focus:bg-black focus:text-white transition-all "
      >
        + Create Group
      </motion.button>

      <AnimatePresence>
        {open && <CreateGroupModal onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default CreateGroupButton;
