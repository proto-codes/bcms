const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const { getProfile, updateProfile } = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Get user details
router.get('/user', authenticateToken, getUserDetails);

// Get user profile
router.get('/profile', authenticateToken, getProfile);

// Update user profile
router.put('/profile', authenticateToken, upload.single('avatar'), updateProfile);

module.exports = router;
