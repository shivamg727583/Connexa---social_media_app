const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");
const isFriends = require("../middlewares/isFriends");

const {
  sendMessage,
  getMessages,
  deleteChat,
  getAllConversations,
  sendGroupMessage,
  getGroupMessages,
} = require("../controllers/message.controller");

router.get("/conversations", isAuthenticated, getAllConversations);

router
  .route("/:id")
  .post(isAuthenticated, isFriends, sendMessage)
  .get(isAuthenticated, isFriends, getMessages);

router.delete("/chat/:userId", isAuthenticated, deleteChat);

router
  .route("/group/:groupId")
  .post(isAuthenticated, sendGroupMessage)
  .get(isAuthenticated, getGroupMessages);

module.exports = router;