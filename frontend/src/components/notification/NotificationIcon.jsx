
import PropTypes from 'prop-types'
import { NOTIFICATION_ICONS } from './notification-icon';

const NotificationIcon = ({ type }) => {
  const config = NOTIFICATION_ICONS[type];
  if (!config) return null;

  const Icon = config.component;
  return (
    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.textColor}`} fill={type === "post_like" ? "currentColor" : "none"} />
    </div>
  );
};

NotificationIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default NotificationIcon