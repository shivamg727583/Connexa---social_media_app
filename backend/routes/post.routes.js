const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer");

const {
  addNewPost,
  getAllPost,
  getUserPosts,
  getUserPostsById,
  getPostById,
  deletePost,

  toggleLikePost,
  toggleSavePost,

  addComment,
  getCommentsOfPost,
  deleteComment,
} = require("../controllers/post.controller");

router
  .route("/")
  .post(isAuthenticated, upload.single("image"), addNewPost)
  .get(isAuthenticated, getAllPost);

router.route("/me").get(isAuthenticated, getUserPosts);

router.route("/user/:userId").get(isAuthenticated, getUserPostsById);

router
  .route("/:postId")
  .get(isAuthenticated, getPostById)
  .delete(isAuthenticated, deletePost);

router.route("/:postId/like").put(isAuthenticated, toggleLikePost);

router.route("/:postId/save").put(isAuthenticated, toggleSavePost);

router
  .route("/:postId/comments")
  .post(isAuthenticated, addComment)
  .get(isAuthenticated, getCommentsOfPost);

router.route("/comments/:commentId").delete(isAuthenticated, deleteComment);

module.exports = router;
