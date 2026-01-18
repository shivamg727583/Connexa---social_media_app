import { motion } from "framer-motion";
import PropTypes from "prop-types";

export const PageContainer = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${className}`}
  >
    {children}
  </motion.div>
);

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const PageHeader = ({ title, subtitle, action, icon: Icon }) => (
  <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 py-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  </div>
);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  icon: PropTypes.elementType,
};

export const ContentWrapper = ({ children, maxWidth = "7xl", className = "" }) => (
  <div className={`max-w-${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
    {children}
  </div>
);

ContentWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  maxWidth: PropTypes.string,
  className: PropTypes.string,
};

export const LoadingSpinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className="flex items-center justify-center py-20">
      <div className={`${sizeClasses[size]} border-4 border-purple-600 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
    {Icon && (
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 opacity-50" />
      </div>
    )}
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);

EmptyState.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
};

export const TabNavigation = ({ tabs, activeTab, onChange }) => (
  <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2">
    {tabs.map((tab) => (
      <motion.button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
          activeTab === tab.id
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow"
        }`}
      >
        <span className="flex items-center gap-2">
          {tab.icon && <tab.icon className="w-4 h-4" />}
          {tab.label}
          {tab.count !== undefined && (
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
              {tab.count}
            </span>
          )}
        </span>
      </motion.button>
    ))}
  </div>
);

TabNavigation.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.elementType,
      count: PropTypes.number,
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};