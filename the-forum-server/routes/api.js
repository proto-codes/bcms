// All API routes
const express = require('express');

const {
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
const messagesController = require('../controllers/messagesController');
const upload = require('../config/multer');

const router = express.Router();

// Logout Route
router.post('/logout', logout);

// Token validation route
router.post('/validate-token', (req, res) => {
  // If the token is valid, respond with a success message and user info if needed
  res.json({ valid: true, user: req.user });
});

// User settings routes
router.put('/change-password', changePassword);
router.put('/notification-preferences', updateNotificationPreferences);
router.delete('/delete-account', deleteAccount);

// User routes
router.get('/user', getUserDetails);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', upload.single('profile_pics'), updateProfile);

// Notification preferences
router.get('/notification-preferences', fetchNotificationPreferences);

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasksByUser);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

// Search route
router.get('/search', searchUsers);

// Messaging routes
router.get('/conversations', messagesController.fetchConversations);
router.get('/conversations/:conversationId/messages', messagesController.fetchMessages);
router.post('/messages', messagesController.sendMessage);
router.put('/messages/:messageId/read', messagesController.updateMessageStatus);
router.delete('/messages/:messageId', messagesController.deleteMessage);

module.exports = router;
