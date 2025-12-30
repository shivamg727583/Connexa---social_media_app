const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");

const {
  addNewPost,
  getAllPost,
  getUserPosts,
  getUserPostsById,
  deletePost,
  likePost,
  dislikePost,
  addComment,
  getCommentsOfPost, 
  deleteComment,
  getPostById
} = require("../controllers/post.controller");
const upload = require("../middlewares/multer");


router
  .route("/")
  .post(isAuthenticated, upload.single("image"), addNewPost)
  .get(isAuthenticated, getAllPost);


router
  .route("/me")
  .get(isAuthenticated, getUserPosts);


router
  .route("/user/:userId")
  .get(isAuthenticated, getUserPostsById);


router
  .route("/:postId")
  .delete(isAuthenticated, deletePost)
  .get(isAuthenticated, getPostById);

router
  .route("/:postId/like")
  .put(isAuthenticated, likePost);

router
  .route("/:postId/unlike")
  .put(isAuthenticated, dislikePost);


router
  .route("/:postId/comments")
  .post(isAuthenticated, addComment)
  .get(isAuthenticated, getCommentsOfPost);


router
  .route("/comments/:commentId")
  .delete(isAuthenticated, deleteComment);



module.exports = router;
