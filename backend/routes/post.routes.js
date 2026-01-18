const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer");

const {
  addNewPost,
  getHomeFeed,
  getGroupFeed,
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


router.post(
  "/",
  isAuthenticated,
  upload.single("image"),
  addNewPost
);


router.get("/", isAuthenticated, getHomeFeed);

router.get(
  "/group/:groupId",
  isAuthenticated,
  getGroupFeed
);


router.get("/me", isAuthenticated, getUserPosts);


router.get("/user/:userId", isAuthenticated, getUserPostsById);


router
  .route("/:postId")
  .get(isAuthenticated, getPostById)
  .delete(isAuthenticated, deletePost);

router.put("/:postId/like", isAuthenticated, toggleLikePost);
router.put("/:postId/save", isAuthenticated, toggleSavePost);

router
  .route("/:postId/comments")
  .post(isAuthenticated, addComment)
  .get(isAuthenticated, getCommentsOfPost);

router.delete(
  "/comments/:commentId",
  isAuthenticated,
  deleteComment
);

module.exports = router;
