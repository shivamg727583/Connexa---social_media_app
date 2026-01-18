const Group = require("../models/group.model");
const User = require("../models/user.model");
const { createNotification } = require("./notification.controller");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudanary");

exports.createGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { name, description = "", privacy = "public" } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Group name required" });
    }

    const groupData = {
      name: name.trim(),
      description,
      privacy,
      adminId: userId,
      members: [userId],
    };

    if (req.files?.coverImage) {
      const buffer = await sharp(req.files.coverImage[0].buffer)
        .resize({ width: 1200, height: 400, fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(fileUri, {
        folder: "group-covers",
      });
      groupData.coverImage = upload.secure_url;
    }

    if (req.files?.avatar) {
      const buffer = await sharp(req.files.avatar[0].buffer)
        .resize({ width: 400, height: 400, fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      const fileUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;
      const upload = await cloudinary.uploader.upload(fileUri, {
        folder: "group-avatars",
      });
      groupData.avatar = upload.secure_url;
    }

    const group = await Group.create(groupData);

    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId).select(
      "members joinRequests adminId privacy"
    );
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.some((id) => id.equals(userId))) {
      return res.json({ message: "Already a member" });
    }

    if (group.joinRequests.some((id) => id.equals(userId))) {
      return res.json({ message: "Request already sent" });
    }

    if (group.privacy === "public") {
      group.members.push(userId);
      await group.save();

      await createNotification({
        recipient: group.adminId,
        sender: userId,
        type: "group_join_approved",
        message: "joined your group",
      });

      return res.json({ success: true, message: "Joined group successfully" });
    }

    group.joinRequests.push(userId);
    await group.save();

    await createNotification({
      recipient: group.adminId,
      sender: userId,
      type: "group_join_request",
      message: "requested to join your group",
    });

    res.json({ success: true, message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.cancelJoinRequest = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.joinRequests = group.joinRequests.filter(
      (id) => !id.equals(userId)
    );
    await group.save();

    res.json({ success: true, message: "Request cancelled" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveMember = async (req, res) => {
  try {
    const adminId = req.userId;
    const { groupId, memberId, reject = false } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.adminId.equals(adminId)) {
      return res.status(403).json({ message: "Only admin can approve members" });
    }

    if (!group.joinRequests.some((id) => id.equals(memberId))) {
      return res.status(400).json({ message: "No such join request" });
    }

    group.joinRequests = group.joinRequests.filter(
      (id) => !id.equals(memberId)
    );

    if (!reject) {
      group.members.push(memberId);

      await createNotification({
        recipient: memberId,
        sender: adminId,
        type: "group_join_approved",
        message: "approved your group join request",
      });
    }

    await group.save();

    res.json({
      success: true,
      message: reject ? "Request rejected" : "Member approved",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const adminId = req.userId;
    const { groupId, memberId } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (!group.adminId.equals(adminId)) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    group.members = group.members.filter((id) => !id.equals(memberId));
    await group.save();

    res.json({ success: true, message: "Member removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await Group.find({
      members: userId,
    })
      .populate("adminId", "username profilePicture")
      .populate("members", "username profilePicture")
      .populate("joinRequests", "username profilePicture email")
      .sort({ createdAt: -1 });

    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllGroups = async (req, res) => {
  try {
    const userId = req.userId;
    const groups = await Group.find({
      members: { $ne: userId },
    })
      .populate("joinRequests", "_id")
      
      .sort({ createdAt: -1 });

    res.json({ success: true, groups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("adminId", "username profilePicture")
      .populate("members", "username profilePicture")
      .populate("joinRequests", "username profilePicture email");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json({ success: true, group });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGroupCover = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.adminId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update cover",
      });
    }

    const buffer = await sharp(image.buffer)
      .resize({ width: 1200, height: 400, fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    if (group.coverImage) {
      const publicId = group.coverImage.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`group-covers/${publicId}`);
    }

    const upload = await cloudinary.uploader.upload(fileUri, {
      folder: "group-covers",
    });

    group.coverImage = upload.secure_url;
    await group.save();

    res.status(200).json({
      success: true,
      coverImage: upload.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateGroupAvatar = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.userId;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (group.adminId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only admin can update avatar",
      });
    }

    const buffer = await sharp(image.buffer)
      .resize({ width: 400, height: 400, fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${buffer.toString("base64")}`;

    if (group.avatar) {
      const publicId = group.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`group-avatars/${publicId}`);
    }

    const upload = await cloudinary.uploader.upload(fileUri, {
      folder: "group-avatars",
    });

    group.avatar = upload.secure_url;
    await group.save();

    res.status(200).json({
      success: true,
      avatar: upload.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};