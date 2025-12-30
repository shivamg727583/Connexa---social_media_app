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
        message: "Message cannot be empty" 
      });
    }

    const io = global.io;
    const getReceiverSocketId = global.getReceiverSocketId;

    if (!io || !getReceiverSocketId) {
      console.error(" Socket.io not initialized properly");
    }

    let conversation = await conversationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [senderId, receiverId],
        deletedBy: [] 
      });
    } else {
      // If conversation exists but was deleted by sender, restore it for them
      if (conversation.deletedBy && conversation.deletedBy.includes(senderId)) {
        conversation.deletedBy = conversation.deletedBy.filter(
          id => id.toString() !== senderId.toString()
        );
        await conversation.save();
      }
      
      // If conversation was deleted by receiver, restore it for them too when they send a message
      if (conversation.deletedBy && conversation.deletedBy.includes(receiverId)) {
        conversation.deletedBy = conversation.deletedBy.filter(
          id => id.toString() !== receiverId.toString()
        );
        await conversation.save();
      }
    }

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      message: message.trim(),
    });


   
    const unread = conversation.unreadCount.get(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), unread + 1);
    conversation.lastMessage = newMessage._id;
    await conversation.save();

    // Emit to receiver
    if (io && getReceiverSocketId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
          conversationId: conversation._id,
          message: newMessage,
        });
      }

      // Emit to sender (for multi-device sync)
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", {
          conversationId: conversation._id,
          message: newMessage,
        });
      }
    }

    res.status(201).json({ 
      success: true, 
      message: newMessage 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to send message",
      error: error.message 
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
      participants: { $all: [senderId, receiverId] }
    });

    if (conversation && conversation.deletedBy && conversation.deletedBy.includes(senderId)) {
      conversation.deletedBy = conversation.deletedBy.filter(
        id => id.toString() !== senderId.toString()
      );
      await conversation.save();
    }

    if (!conversation) {
      return res.json({ 
        success: true, 
        messages: [],
        conversationId: null,
        unreadCount: 0
      });
    }

    const lastCleared = conversation.clearedAt ? conversation.clearedAt.get(senderId.toString()) : null;

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

    const unreadCount = conversation.unreadCount.get(senderId.toString()) || 0;

    res.json({ 
      success: true, 
      messages, 
      conversationId: conversation._id,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const userId = req.userId;
    const { conversationId } = req.params;

    if (!conversationId || conversationId === "undefined") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid conversation ID" 
      });
    }

    const result = await messageModel.updateMany(
      { 
        conversationId, 
        receiverId: userId, 
        seen: false 
      },
      { seen: true }
    );


    await conversationModel.findByIdAndUpdate(conversationId, {
      $set: { [`unreadCount.${userId}`]: 0 },
    });

    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to mark messages as read",
      error: error.message 
    });
  }
};






exports.deleteChat = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;

    const conversation = await conversationModel.findOne({
      participants: { $all: [userId, otherUserId] }
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }
    if (!conversation.deletedBy) conversation.deletedBy = [];
    if (!conversation.deletedBy.includes(userId)) {
      conversation.deletedBy.push(userId);
    }
    if (!conversation.clearedAt) conversation.clearedAt = new Map();
    conversation.clearedAt.set(userId.toString(), new Date()); 

    if (conversation.unreadCount) {
        conversation.unreadCount.set(userId.toString(), 0);
    }

    await conversation.save();

    res.json({ 
      success: true, 
      message: "Chat deleted and history cleared successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete chat" });
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

    const conversationsData = conversations.map(conv => {
      const otherUser = conv.participants.find(
        p => p._id.toString() !== userId
      );

      return {
        userId: otherUser._id,
        user: otherUser,
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount?.[userId] || 0,
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