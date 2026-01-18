const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer");

const {
  createGroup,
  joinGroup,
  cancelJoinRequest,
  approveMember,
  removeMember,
  getMyGroups,
  getGroupById,
  updateGroupCover,
  updateGroupAvatar,
  getAllGroups,
} = require("../controllers/group.controller");

router.route("/").post(
  isAuthenticated,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "avatar", maxCount: 1 },
  ]),
  createGroup
);

router.route("/all").get(isAuthenticated, getAllGroups);
router.route("/my").get(isAuthenticated, getMyGroups);
router.route("/:groupId").get(isAuthenticated, getGroupById);
router.route("/:groupId/join").post(isAuthenticated, joinGroup);
router.route("/:groupId/cancel-request").post(isAuthenticated, cancelJoinRequest);
router.route("/approve").post(isAuthenticated, approveMember);
router.route("/remove-member").post(isAuthenticated, removeMember);

router
  .route("/:groupId/cover")
  .patch(isAuthenticated, upload.single("image"), updateGroupCover);

router
  .route("/:groupId/avatar")
  .patch(isAuthenticated, upload.single("image"), updateGroupAvatar);

module.exports = router;