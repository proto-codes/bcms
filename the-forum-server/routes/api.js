const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const { changePassword, updateNotificationPreferences, deleteAccount } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// User settings routes
router.put('/change-password', authenticateToken, changePassword);
router.put('/notification-preferences', authenticateToken, updateNotificationPreferences);
router.delete('/delete-account', authenticateToken, deleteAccount);

module.exports = router;
