const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");
const isFriends = require("../middlewares/isFriends");

const {
  sendMessage,
  getMessages,
  deleteChat,
  getAllConversations,
} = require("../controllers/message.controller");

router.route("/conversations").get(isAuthenticated, getAllConversations);

router
  .route("/:id")
  .post(isAuthenticated, isFriends, sendMessage)
  .get(isAuthenticated, isFriends, getMessages);


router.route("/chat/:userId").delete(isAuthenticated, deleteChat);

module.exports = router;
