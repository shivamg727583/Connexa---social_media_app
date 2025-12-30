const notificationModel = require("../models/notification.model");

exports.createNotification = async ({
  recipient,
  sender,
  type,
  message,
  post,
  comment,
  friendRequest,
}) => {
  try {
    if (recipient.toString() === sender.toString()) {
      return null;
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existingNotification = await notificationModel.findOne({
      recipient,
      sender,
      type,
      post,
      createdAt: { $gte: fiveMinutesAgo },
    });

    if (existingNotification) {
      return existingNotification;
    }

    const notification = await notificationModel.create({
      recipient,
      sender,
      type,
      message,
      post,
      comment,
      friendRequest,
    });

    await notification.populate("sender", "_id username profilePicture");

    const io = global.io;
    const getReceiverSocketId = global.getReceiverSocketId;

    if (io && getReceiverSocketId) {
      const recipientSocketId = getReceiverSocketId(recipient.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", notification);
      } 
    } 

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const userId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await notificationModel
      .find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "_id username profilePicture")
      .populate("post", "_id image")
      .lean();

    const totalNotifications = await notificationModel.countDocuments({
      recipient: userId,
    });

    const unreadCount = await notificationModel.countDocuments({
      recipient: userId,
      read: false,
    });

    res.status(200).json({
      success: true,
      notifications,
      unreadCount,
      totalPages: Math.ceil(totalNotifications / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await notificationModel.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.userId;

    await notificationModel.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
      error: error.message,
    });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    const notification = await notificationModel.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

exports.clearAllNotifications = async (req, res) => {
  try {
    const userId = req.userId;

    await notificationModel.deleteMany({ recipient: userId });

    res.status(200).json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to clear notifications",
      error: error.message,
    });
  }
};