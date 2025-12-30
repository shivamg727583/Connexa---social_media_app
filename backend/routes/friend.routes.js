const express = require('express');
const { sendRequest, acceptRequest, rejectRequest, getFriendStatus, getIncomingRequests, getSentRequests, getFriends, cancelRequest, getMutualFriends } = require('../controllers/friend.controller');
const isAuthenticated = require('../middlewares/auth.middleware');
const router = express.Router();



router.route('/send-request').post(isAuthenticated, sendRequest);
router.route('/accept-request').post(isAuthenticated, acceptRequest);
router.route('/reject-request').post(isAuthenticated, rejectRequest);
router.route('/cancel-request').delete(isAuthenticated, cancelRequest);


router.route('/incoming-requests').get(isAuthenticated, getIncomingRequests);
router.route('/sent-requests').get(isAuthenticated, getSentRequests);

router.route('/get-friend-status/:userId').get(isAuthenticated, getFriendStatus);

router.route('/:userId/mutual-friends').get(isAuthenticated, getMutualFriends);
router.route('/:userId').get(isAuthenticated, getFriends);








module.exports = router;