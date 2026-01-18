const sharp = require("sharp");
const cloudinary = require("../utils/cloudanary");
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Comment = require("../models/comment.model");
const { createNotification } = require("./notification.controller");
const Group = require("../models/group.model");

exports.addNewPost = async (req, res) => {
  try {
    const userId = req.userId;
    const image = req.file;
    const { caption = "", contextType = "USER", contextId = null } = req.body;

    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    if (contextType === "GROUP") {
      if (!contextId) {
        return res.status(400).json({ message: "Group id required" });
      }

      const group = await Group.findById(contextId).select("members");
      if (!group || !group.members.some((id) => id.equals(userId))) {
        return res.status(403).json({ message: "Not a group member" });
      }
    }

    // Image optimization
    const optimizedImage = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .jpeg({ quality: 80 })
      .toBuffer();

    const upload = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${optimizedImage.toString("base64")}`,
      { folder: "posts" }
    );

    const post = await Post.create({
      author: userId,
      caption,
      image: upload.secure_url,
      contextType,
      contextId,
    });

    await post.populate("author", "username profilePicture");

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
      isSaved:
        user?.savedPosts?.some(
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
      isSaved:
        user?.savedPosts?.some(
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
      isSaved:
        currentUser?.savedPosts?.some(
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
      isSaved:
        currentUser?.savedPosts?.some(
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
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      isLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
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
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const user = await User.findById(userId).select("savedPosts");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
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

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment text required" });
    }

    const post = await Post.findById(postId).select(
      "author contextType contextId"
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // 🔐 Group post access check
    if (post.contextType === "GROUP") {
      const group = await Group.findById(post.contextId).select("members");
      if (!group || !group.members.some((id) => id.equals(userId))) {
        return res.status(403).json({ message: "Not a group member" });
      }
    }

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    });

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    if (!post.author.equals(userId)) {
      await createNotification({
        recipient: post.author,
        sender: userId,
        type: "post_comment",
        message: "commented on your post",
        post: postId,
        comment: comment._id,
      });
    }

    await comment.populate("author", "username profilePicture");

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

exports.getHomeFeed = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.userId).select("savedPosts").lean();

    const posts = await Post.find({ contextType: "USER" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      })
      .lean();

    const postsWithSaveStatus = posts.map((post) => ({
      ...post,
      isSaved: user?.savedPosts?.some((id) => id.equals(post._id)) || false,
    }));
    res.json({ success: true, posts: postsWithSaveStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


exports.getGroupFeed = async (req, res) => {
  try {
    const userId = req.userId;
    const { groupId } = req.params;

    const group = await Group.findById(groupId).select("members privacy");
    
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some((id) => id.equals(userId));
    
    if (group.privacy === "private" && !isMember) {
      return res.status(403).json({ message: "Not a group member" });
    }

    const user = await User.findById(userId).select("savedPosts").lean();

    const posts = await Post.find({
      contextType: "GROUP",
      contextId: groupId,
    })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture")
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: { path: "author", select: "username profilePicture" },
      })
      .lean();

    const postsWithSaveStatus = posts.map((post) => ({
      ...post,
      isSaved: user?.savedPosts?.some((id) => id.equals(post._id)) || false,
    }));

    res.json({ success: true, groupId, posts: postsWithSaveStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
