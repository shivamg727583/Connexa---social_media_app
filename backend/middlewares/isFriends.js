const User = require("../models/user.model");

const isFriend = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot chat with yourself",
      });
    }

    const user = await User.findById(senderId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFriend = user.friends.includes(receiverId);

    if (!isFriend) {
      return res.status(403).json({
        success: false,
        message: "You can only chat with friends",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = isFriend;
