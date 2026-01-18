import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import PropTypes from "prop-types";

const BackButton = ({
  label = "Back",
  to,
  className = "",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      onClick={handleBack}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        inline-flex items-center gap-2
        px-4 py-2
        rounded-full
        bg-white/90 backdrop-blur
        text-gray-800
        shadow-md hover:shadow-lg
        transition
        ${className}
      `}
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
};

BackButton.propTypes = {
  label: PropTypes.string,
  to: PropTypes.string,
  className: PropTypes.string,
};

export default BackButton;
