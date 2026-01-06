const mongoose = require("mongoose");
const friendRequestModel = require("../models/friendRequest.model");
const userModel = require("../models/user.model");
const { createNotification } = require("./notification.controller");

exports.sendRequest = async (req, res) => {
  try {
    const from = req.userId;
    const { to } = req.body;

    if (!to) {
      return res.status(400).json({ message: "Receiver id required" });
    }

    if (from === to) {
      return res.status(400).json({
        message: "You cannot send request to yourself",
      });
    }

    const receiver = await userModel.findById(to);
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const sender = await userModel.findById(from);
    if (sender.friends.includes(to)) {
      return res.status(400).json({
        message: "You are already friends",
      });
    }

    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { from, to, status: "pending" },
        { from: to, to: from, status: "pending" },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Friend request already exists",
      });
    }

    const request = await friendRequestModel.create({ from, to });

    const populatedRequest = await friendRequestModel
      .findById(request._id)
      .populate("to", "username profilePicture");

    await createNotification({
      recipient: to,
      sender: from,
      type: "friend_request",
      message: `${sender.username} sent you a friend request`,
      friendRequest: request._id,
    });

    const io = global.io;
const getReceiverSocketId = global.getReceiverSocketId;

const receiverSocketId = getReceiverSocketId(to);
if (receiverSocketId) {
  io.to(receiverSocketId).emit("friendRequestReceived", {
    request: populatedRequest,
  });
}


    res.status(201).json({
      message: "Friend request sent",
      request: populatedRequest,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    const request = await friendRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
        success: false,
      });
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized",
        success: false,
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
        success: false,
      });
    }

    await Promise.all([
      userModel.findByIdAndUpdate(request.from, {
        $addToSet: { friends: request.to },
        $inc: { totalFriends: 1 },
      }),
      userModel.findByIdAndUpdate(request.to, {
        $addToSet: { friends: request.from },
        $inc: { totalFriends: 1 },
      }),
    ]);

    request.status = "accepted";
    await request.save();

    const friendData = await userModel
      .findById(request.from)
      .select("_id username profilePicture");

    const accepter = await userModel.findById(userId);

    await createNotification({
      recipient: request.from,
      sender: userId,
      type: "friend_accept",
      message: `${accepter.username} accepted your friend request`,
      friendRequest: request._id,
    });

    const io = global.io;
const getReceiverSocketId = global.getReceiverSocketId;

// notify sender
const senderSocketId = getReceiverSocketId(request.from.toString());
if (senderSocketId) {
  io.to(senderSocketId).emit("friendRequestAccepted", {
    friend: {
      _id: userId,
      username: accepter.username,
      profilePicture: accepter.profilePicture,
    },
    requestId: request._id,
  });
}


    res.status(200).json({
      message: "Friend request accepted",
      success: true,
      requestId: request._id,
      friend: friendData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    const request = await friendRequestModel.findById(requestId);
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    request.status = "rejected";
    await request.save();

    const receiverSocketId = getReceiverSocketId(request.from.toString());
if (receiverSocketId) {
  io.to(receiverSocketId).emit("friendRequestRejected", {
    requestId,
  });
}


    res.status(200).json({
      message: "Friend request rejected",
      success: true,
      requestId: request._id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    const from = req.userId;
    const { to } = req.body;

    const request = await friendRequestModel.findOneAndDelete({
      from,
      to,
      status: "pending",
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.json({ success: true, message: "Request cancelled", to });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await friendRequestModel
      .find({
        from: userId,
        status: "pending",
      })
      .populate("to", "_id username profilePicture");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getIncomingRequests = async (req, res) => {
  try {
    const userId = req.userId;
    const requests = await friendRequestModel
      .find({
        to: userId,
        status: "pending",
      })
      .populate("from", "_id username profilePicture");

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel
      .findById(userId)
      .populate("friends", "_id username profilePicture");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getFriendStatus = async (req, res) => {
  try {
    const myId = req.userId;
    const otherId = req.params.userId;

    const me = await userModel.findById(myId);
    if (me.friends.includes(otherId)) {
      return res.json({ status: "friends" });
    }

    const request = await friendRequestModel.findOne({
      $or: [
        { from: myId, to: otherId, status: "pending" },
        { from: otherId, to: myId, status: "pending" },
      ],
    });

    if (!request) return res.json({ status: "follow" });

    if (request.from.toString() === myId) {
      return res.json({ status: "requested" });
    }

    return res.json({ status: "accept" });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.getMutualFriends = async (req, res) => {
  try {
    const currentUserId = new mongoose.Types.ObjectId(req.userId);
    const profileUserId = new mongoose.Types.ObjectId(req.params.userId);

    const [currentUser, profileUser] = await Promise.all([
      userModel.findById(currentUserId).select("friends"),
      userModel.findById(profileUserId).select("friends"),
    ]);

    if (!currentUser || !profileUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const mutualFriendIds = currentUser.friends.filter((id) =>
      profileUser.friends.some((fid) => fid.equals(id))
    );

    const mutualFriendsPreview = await userModel
      .find({ _id: { $in: mutualFriendIds } })
      .select("_id username profilePicture");

    return res.status(200).json({
      success: true,
      count: mutualFriendIds.length,
      mutualFriends: mutualFriendsPreview,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mutual friends",
      error: error.message,
    });
  }
};