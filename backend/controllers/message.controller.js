const conversationModel = require("../models/conversation.model");
const messageModel = require("../models/message.model");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    const io = global.io;
    const getReceiverSocketId = global.getReceiverSocketId;

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    let isNewConversation = false;

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
        deletedBy: [],
      });
      isNewConversation = true;
    } else {
      // restore chat if deleted
      if (conversation.deletedBy?.includes(senderId)) {
        conversation.deletedBy = conversation.deletedBy.filter(
          (id) => id.toString() !== senderId.toString()
        );
      }
      if (conversation.deletedBy?.includes(receiverId)) {
        conversation.deletedBy = conversation.deletedBy.filter(
          (id) => id.toString() !== receiverId.toString()
        );
      }
      await conversation.save();
    }

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message: message.trim(),
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // realtime emit

    if (isNewConversation && io && getReceiverSocketId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      const senderSocketId = getReceiverSocketId(senderId);

      const payloadForReceiver = {
        userId: senderId,
        user: {
          _id: senderId,
          username: req.user.username,
          profilePicture: req.user.profilePicture,
        },
        lastMessage: {
          message: newMessage.message,
          senderId,
          timestamp: newMessage.createdAt,
        },
        timestamp: newMessage.createdAt,
      };

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newConversation", payloadForReceiver);
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("newConversation", {
          ...payloadForReceiver,
          userId: receiverId,
        });
      }
    }

    if (io && getReceiverSocketId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      const senderSocketId = getReceiverSocketId(senderId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          conversationId: conversation._id,
          message: newMessage,
        });
      }

      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", {
          conversationId: conversation._id,
          message: newMessage,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const page = Number(req.query.page) || 1;
    const limit = 50;

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (conversation?.deletedBy?.includes(senderId)) {
      conversation.deletedBy = conversation.deletedBy.filter(
        (id) => id.toString() !== senderId.toString()
      );
      await conversation.save();
    }

    if (!conversation) {
      return res.json({
        success: true,
        messages: [],
        conversationId: null,
      });
    }

    const lastCleared = conversation.clearedAt
      ? conversation.clearedAt.get(senderId.toString())
      : null;

    const query = { conversationId: conversation._id };
    if (lastCleared) {
      query.createdAt = { $gt: lastCleared };
    }

    const messages = await messageModel
      .find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      messages,
      conversationId: conversation._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;

    const conversation = await conversationModel.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    if (!conversation.deletedBy) conversation.deletedBy = [];
    if (!conversation.deletedBy.includes(userId)) {
      conversation.deletedBy.push(userId);
    }

    if (!conversation.clearedAt) conversation.clearedAt = new Map();
    conversation.clearedAt.set(userId.toString(), new Date());

    await conversation.save();

    res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
    });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.userId.toString();

    const conversations = await conversationModel
      .find({
        participants: userId,
        deletedBy: { $ne: userId },
      })
      .populate("participants", "_id username profilePicture")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    const conversationsData = conversations.map((conv) => {
      const otherUser = conv.participants.find(
        (p) => p._id.toString() !== userId
      );

      return {
        userId: otherUser._id,
        user: otherUser,
        lastMessage: conv.lastMessage,
        timestamp: conv.updatedAt,
      };
    });

    res.json({
      success: true,
      conversations: conversationsData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};
