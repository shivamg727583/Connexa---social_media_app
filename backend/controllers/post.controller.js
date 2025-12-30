const sharp = require("sharp");
const cloudinary = require("../utils/cloudanary");
const postModel = require("../models/post.model");
const userModel = require("../models/user.model");
const commentModel = require("../models/comment.model");
const { createNotification } = require("./notification.controller");

exports.addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.userId;

    if (!image) {
      return res.status(400).json({
        message: "Image required",
        success: false,
      });
    }

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "posts",
    });

    const post = await postModel.create({
      author: userId,
      image: cloudResponse.secure_url,
      caption,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { posts: post._id },
    });

    await post.populate({ path: "author", select: "username profilePicture" });

    return res.status(201).json({
      message: "Post uploaded successfully",
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "_id username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "_id username profilePicture",
        },
      })
      .lean();

    const totalPosts = await postModel.countDocuments();

    res.status(200).json({
      posts,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "_id username profilePicture",
      })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "_id username profilePicture",
        },
      });

    const totalPosts = await postModel.countDocuments({ author: userId });

    return res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      page,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
      success: false,
    });
  }
};

exports.getUserPostsById = async (req, res) => {
  try {
    const { userId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const posts = await postModel
      .find({ author: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "_id username profilePicture")
      .lean();

    const totalPosts = await postModel.countDocuments({ author: userId });

    res.status(200).json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      page,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel
      .findById(postId)
      .populate("author", "_id username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "author",
          select: "_id username profilePicture",
        },
      })
      .lean();
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }
    res.status(200).json({ post, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.likePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await postModel.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const user = await userModel
      .findById(userId)
      .select("_id username profilePicture");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const postOwnerId = post.author.toString();
    
    if (postOwnerId !== userId) {
      await createNotification({
        recipient: postOwnerId,
        sender: userId,
        type: "post_like",
        message: `${user.username} liked your post`,
        post: postId,
      });
    }

    res.status(200).json({
      success: true,
      postId,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.dislikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await postModel.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      postId,
      likes: post.likes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Text is required", success: false });
    }

    const post = await postModel.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const comment = await commentModel.create({
      text,
      author: userId,
      post: postId,
    });

    await comment.populate("author", "username profilePicture");

    post.comments.push(comment._id);
    await post.save();

    const commenter = await userModel
      .findById(userId)
      .select("username");

    //  Create notification
    const postOwnerId = post.author.toString();
    if (postOwnerId !== userId) {
      await createNotification({
        recipient: postOwnerId,
        sender: userId,
        type: "post_comment",
        message: `${commenter.username} commented on your post`,
        post: postId,
        comment: comment._id,
      });
    }

    res.status(201).json({
      message: "Comment added",
      success: true,
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.getCommentsOfPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentModel
      .find({ post: postId })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
        success: false,
      });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`posts/${publicId}`);
    }

    await commentModel.deleteMany({ post: postId });

    await userModel.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });

    await postModel.findByIdAndDelete(postId);

    res.status(200).json({
      message: "Post deleted successfully",
      postId,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
        success: false,
      });
    }

    const post = await postModel.findById(comment.post);

    const isCommentOwner = comment.author.toString() === userId;
    const isPostOwner = post && post.author.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
        success: false,
      });
    }

    await postModel.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });

    await commentModel.findByIdAndDelete(commentId);

    res.status(200).json({
      message: "Comment deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};