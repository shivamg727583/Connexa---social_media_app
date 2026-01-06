const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const getDataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudanary");
const friendRequestModel = require("../models/friendRequest.model");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res
        .status(401)
        .json({ message: "Please fill all inputs", success: false });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User is already registered.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      message: "Registered successfully",
      success: true,
      user: userData,
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Missing inputs", success: false });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email or Password is incorrect", success: false });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userData } = user._doc;

    res.status(200).json({
      message: `Welcome back`,
      success: true,
      token,
      user: userData,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Something went wrong",
      error: err.message,
      success: false,
    });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel
      .findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "_id username profilePicture",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              select: "_id username profilePicture",
            },
          },
        ],
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }



    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
      success: false,
    });
  }
};


exports.getProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userModel
      .findById(userId)
      .populate({
        path: "posts",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "author",
            select: "_id username profilePicture",
          },
          {
            path: "comments",
            populate: {
              path: "author",
              select: "_id username profilePicture",
            },
          },
        ],
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
      success: false,
    });
  }
};



exports.editProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender.toLowerCase();

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};



exports.getSuggestedUsers = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const currentUser = await userModel
      .findById(userId)
      .select("friends");

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const requests = await friendRequestModel.find({
      $or: [
        { from: userId },
        { to: userId },
      ],
      status: "pending",
    }).select("from to");

    const requestUserIds = requests.map((req) =>
      req.from.equals(userId) ? req.to : req.from
    );

    
    const excludeIds = [
      userId,
      ...currentUser.friends,
      ...requestUserIds,
    ];

    const suggestedUsers = await userModel.aggregate([
      {
        $match: {
          _id: { $nin: excludeIds },
        },
      },
      {
        $addFields: {
          mutualFriendsCount: {
            $size: {
              $setIntersection: ["$friends", currentUser.friends],
            },
          },
        },
      },
      {
        $sort: {
          mutualFriendsCount: -1,
          totalFriends: -1,
        },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      suggestedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suggested users",
      error: error.message,
    });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const userId = req.userId;

    if (!q || !q.trim()) {
      return res.status(200).json({
        users: [],
        success: true,
      });
    }

    const users = await userModel
      .find({
        _id: { $ne: userId },
        username: { $regex: q, $options: "i" },
      })
      .select("_id username profilePicture")
      .limit(20);

    res.status(200).json({
      users,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Search failed",
      success: false,
    });
  }
};

