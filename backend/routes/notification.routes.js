const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = require("../controllers/notification.controller");


router.get("/", isAuthenticated, getNotifications);


router.patch(
  "/:notificationId/read",
  isAuthenticated,
  markAsRead
);


router.patch("/read-all", isAuthenticated, markAllAsRead);


router.delete(
  "/:notificationId",
  isAuthenticated,
  deleteNotification
);

router.delete("/", isAuthenticated, clearAllNotifications);

module.exports = router;