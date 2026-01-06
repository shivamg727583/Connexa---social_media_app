const sharp = require("sharp");
const cloudinary = require("../utils/cloudanary");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const { createNotification } = require("./notification.controller");

exports.addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.userId;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileUri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;

    const upload = await cloudinary.uploader.upload(fileUri, {
      folder: "posts",
    });

    const post = await Post.create({
      author: userId,
      caption,
      image: upload.secure_url,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { posts: post._id },
    });

    await post.populate("author", "username profilePicture");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllPost = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [posts, total, user] = await Promise.all([
      Post.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture")
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        })
        .lean(),
      Post.countDocuments(),
      User.findById(req.userId).select("savedPosts").lean(),
    ]);

    // Add isSaved property to each post based on current user's savedPosts
    const postsWithSaveStatus = posts.map((post) => ({
      ...post,
      isSaved: user?.savedPosts?.some(
        (savedPostId) => savedPostId.toString() === post._id.toString()
      ) || false,
    }));

    return res.status(200).json({
      success: true,
      posts: postsWithSaveStatus,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [posts, total, user] = await Promise.all([
      Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture")
        .lean(),
      Post.countDocuments({ author: userId }),
      User.findById(userId).select("savedPosts").lean(),
    ]);

    // Add isSaved property
    const postsWithSaveStatus = posts.map((post) => ({
      ...post,
      isSaved: user?.savedPosts?.some(
        (savedPostId) => savedPostId.toString() === post._id.toString()
      ) || false,
    }));

    return res.status(200).json({
      success: true,
      posts: postsWithSaveStatus,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUserPostsById = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [posts, total, currentUser] = await Promise.all([
      Post.find({ author: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture")
        .lean(),
      Post.countDocuments({ author: userId }),
      User.findById(currentUserId).select("savedPosts").lean(),
    ]);

    // Add isSaved property
    const postsWithSaveStatus = posts.map((post) => ({
      ...post,
      isSaved: currentUser?.savedPosts?.some(
        (savedPostId) => savedPostId.toString() === post._id.toString()
      ) || false,
    }));

    return res.status(200).json({
      success: true,
      posts: postsWithSaveStatus,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const currentUserId = req.userId;

    const [post, currentUser] = await Promise.all([
      Post.findById(postId)
        .populate("author", "username profilePicture")
        .populate({
          path: "comments",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "author",
            select: "username profilePicture",
          },
        })
        .lean(),
      User.findById(currentUserId).select("savedPosts").lean(),
    ]);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Add isSaved property
    const postWithSaveStatus = {
      ...post,
      isSaved: currentUser?.savedPosts?.some(
        (savedPostId) => savedPostId.toString() === post._id.toString()
      ) || false,
    };

    return res.status(200).json({ success: true, post: postWithSaveStatus });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleLikePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    const post = await Post.findById(postId).select("likes author");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      isLiked
        ? { $pull: { likes: userId } }
        : { $addToSet: { likes: userId } },
      { new: true }
    ).select("likes");

    // Create notification if not the author
    if (!isLiked && post.author.toString() !== userId) {
      await createNotification({
        recipient: post.author,
        sender: userId,
        type: "post_like",
        message: `liked your post`,
        post: postId,
      });
    }

    return res.status(200).json({
      success: true,
      postId,
      likes: updatedPost.likes,
      isLiked: !isLiked,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleSavePost = async (req, res) => {
  try {
    const userId = req.userId;
    const { postId } = req.params;

    // Verify post exists
    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isSaved = user.savedPosts.some(
      (id) => id.toString() === postId.toString()
    );

    await User.findByIdAndUpdate(
      userId,
      isSaved
        ? { $pull: { savedPosts: postId } }
        : { $addToSet: { savedPosts: postId } }
    );

    return res.status(200).json({
      success: true,
      postId,
      isSaved: !isSaved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Comment text required" });
    }

    const post = await Post.findById(postId).select("author");
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    if (post.author.toString() !== userId) {
      await createNotification({
        recipient: post.author,
        sender: userId,
        type: "post_comment",
        message: `commented on your post`,
        post: postId,
        comment: comment._id,
      });
    }

    await comment.populate("author", "username profilePicture");

    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`posts/${publicId}`);
    }

    await Promise.all([
      Comment.deleteMany({ post: postId }),
      User.updateMany(
        { $or: [{ posts: postId }, { savedPosts: postId }] },
        { $pull: { posts: postId, savedPosts: postId } }
      ),
      Post.findByIdAndDelete(postId),
    ]);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      postId,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCommentsOfPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const postExists = await Post.exists({ _id: postId });
    if (!postExists) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const [comments, total] = await Promise.all([
      Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "username profilePicture")
        .lean(),
      Comment.countDocuments({ post: postId }),
    ]);

    return res.status(200).json({
      success: true,
      comments,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(commentId).select("author post");
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const post = await Post.findById(comment.post).select("author");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isCommentOwner = comment.author.toString() === userId;
    const isPostOwner = post.author.toString() === userId;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment",
      });
    }

    await Promise.all([
      Comment.findByIdAndDelete(commentId),
      Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId },
      }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};