// All API routes
const express = require('express');
const { 
  register, 
  login, 
  logout 
} = require('../controllers/authController');
const { 
  changePassword, 
  updateNotificationPreferences, 
  deleteAccount, 
  getUserDetails, 
  fetchNotificationPreferences 
} = require('../controllers/userController');
const { 
  getProfile, 
  updateProfile 
} = require('../controllers/profileController');
const taskController = require('../controllers/taskController');
const { searchUsers } = require('../controllers/searchController');
const messagesController = require('../controllers/messagesController'); // Import the messages controller
const authenticateToken = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// Token validation route
router.post('/validate-token', authenticateToken, (req, res) => {
  // If the token is valid, respond with a success message and user info if needed
  res.json({ valid: true, user: req.user });
});

// User settings routes
router.put('/change-password', authenticateToken, changePassword);
router.put('/notification-preferences', authenticateToken, updateNotificationPreferences);
router.delete('/delete-account', authenticateToken, deleteAccount);

// User routes
router.get('/user', authenticateToken, getUserDetails);

// Profile routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, upload.single('profile_pics'), updateProfile);

// Notification preferences
router.get('/notification-preferences', authenticateToken, fetchNotificationPreferences);

// Task routes
router.post('/tasks', authenticateToken, taskController.createTask);
router.get('/tasks', authenticateToken, taskController.getTasksByUser);
router.put('/tasks/:taskId', authenticateToken, taskController.updateTask);
router.delete('/tasks/:taskId', authenticateToken, taskController.deleteTask);

// Search route
router.get('/search', searchUsers);

// Messaging routes
router.get('/conversations', authenticateToken, messagesController.fetchConversations);
router.get('/conversations/:conversationId/messages', authenticateToken, messagesController.fetchMessages);
router.post('/messages', authenticateToken, messagesController.sendMessage);
router.put('/messages/:messageId/read', authenticateToken, messagesController.updateMessageStatus);
router.delete('/messages/:messageId', authenticateToken, messagesController.deleteMessage);

module.exports = router;
