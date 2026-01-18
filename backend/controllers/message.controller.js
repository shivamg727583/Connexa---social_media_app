const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const Group = require("../models/group.model");

exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.userId;
    const receiverId = req.params.id;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    let isNewConversation = false;

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        deletedBy: [],
        clearedAt: new Map(),
      });
      isNewConversation = true;
    } else {
      conversation.deletedBy = conversation.deletedBy.filter(
        (id) => !id.equals(senderId) && !id.equals(receiverId)
      );
      await conversation.save();
    }

    const newMessage = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverType: "USER",
      receiverId,
      message: message.trim(),
    });

    conversation.lastMessage = newMessage._id;
    await conversation.save();

    const io = global.io;
    const getReceiverSocketId = global.getReceiverSocketId;

    if (io && getReceiverSocketId) {
      const receiverSocketId = getReceiverSocketId(receiverId);
      const senderSocketId = getReceiverSocketId(senderId);

      const payload = {
        conversationId: conversation._id,
        message: newMessage,
      };

      if (receiverSocketId) io.to(receiverSocketId).emit("newMessage", payload);
      if (senderSocketId) io.to(senderSocketId).emit("newMessage", payload);

      if (isNewConversation) {
        const convoPayload = {
          userId: senderId,
          lastMessage: newMessage,
          timestamp: newMessage.createdAt,
        };

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newConversation", convoPayload);
        }
        if (senderSocketId) {
          io.to(senderSocketId).emit("newConversation", {
            ...convoPayload,
            userId: receiverId,
          });
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
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

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.json({
        success: true,
        messages: [],
        conversationId: null,
      });
    }

    conversation.deletedBy = conversation.deletedBy.filter(
      (id) => !id.equals(senderId)
    );
    await conversation.save();

    const clearedAt = conversation.clearedAt?.get(senderId.toString());

    const query = {
      conversationId: conversation._id,
    };

    if (clearedAt) {
      query.createdAt = { $gt: clearedAt };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      messages,
      conversationId: conversation._id,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const userId = req.userId;
    const otherUserId = req.params.userId;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (!conversation.deletedBy.some((id) => id.equals(userId))) {
      conversation.deletedBy.push(userId);
    }

    if (!conversation.clearedAt) conversation.clearedAt = new Map();
    conversation.clearedAt.set(userId.toString(), new Date());

    await conversation.save();

    return res.json({
      success: true,
      message: "Chat cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.userId.toString();

    const conversations = await Conversation.find({
      participants: userId,
      deletedBy: { $ne: userId },
    })
      .populate("participants", "_id username profilePicture")
      .populate("lastMessage")
      .sort({ updatedAt: -1 })
      .lean();

    const data = conversations.map((conv) => {
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

    return res.json({
      success: true,
      conversations: data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

exports.sendGroupMessage = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    const group = await Group.findById(groupId).select("members");
    if (!group || !group.members.some((id) => id.equals(userId))) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const msg = await Message.create({
      senderId: userId,
      receiverType: "GROUP",
      receiverId: groupId,
      message: message.trim(),
    });

    const populatedMsg = await Message.findById(msg._id).populate(
      "senderId",
      "username profilePicture"
    );

    global.io?.to(groupId).emit("groupMessage", {
      message: populatedMsg,
    });

    return res.status(201).json({ success: true, message: populatedMsg });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send group message",
      error: error.message,
    });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId).select("members");
    if (!group || !group.members.some((id) => id.equals(userId))) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const messages = await Message.find({
      receiverType: "GROUP",
      receiverId: groupId,
    })
      .populate("senderId", "username profilePicture")
      .sort({ createdAt: 1 })
      .limit(100);

    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch group messages",
      error: error.message,
    });
  }
};