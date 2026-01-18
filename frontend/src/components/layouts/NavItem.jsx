
import {motion} from 'framer-motion'
import PropTypes from 'prop-types'

const NavItem = ({ item, onClick, showLabel = true }) => {
  const Icon = item.icon;
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all group w-full"
    >
      <div className="relative">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        {item.badge && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {item.badge > 9 ? "9+" : item.badge}
          </span>
        )}
      </div>
      {showLabel && <span className="font-medium text-sm sm:text-base">{item.text}</span>}
    </motion.button>
  );
};



NavItem.propTypes = {
  item: PropTypes.shape({
    icon: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    path: PropTypes.string,
    action: PropTypes.func,
    badge: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  showLabel: PropTypes.bool,
};



export default NavItem