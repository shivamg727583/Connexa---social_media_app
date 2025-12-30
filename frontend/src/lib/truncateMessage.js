export const truncateMessage = (msg, maxLength = 30) => {
    if (!msg) return "";
    return msg.length > maxLength ? msg.substring(0, maxLength) + "..." : msg;
  };