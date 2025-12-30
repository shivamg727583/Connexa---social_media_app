const express = require('express');
const { register, login, getProfile, editProfile, getSuggestedUsers, getProfileById, searchUsers} = require('../controllers/user.controller');
const router = express.Router();
const isAuthenticated = require('../middlewares/auth.middleware');
const upload  = require('../middlewares/multer');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/profile').get(isAuthenticated,getProfile)
router.route('/:id/profile').get(isAuthenticated, getProfileById);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'), editProfile);
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/search').get(isAuthenticated, searchUsers);












module.exports = router;