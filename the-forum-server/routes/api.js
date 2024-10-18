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
const authenticateToken = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// User settings routes
router.put('/change-password', authenticateToken, changePassword);
router.put('/notification-preferences', authenticateToken, updateNotificationPreferences);
router.delete('/delete-account', authenticateToken, deleteAccount);

// User routes
router.get('/user', authenticateToken, getUserDetails);

// Profile routes
router.get('/profile',  getProfile);
router.put('/profile',  upload.single('avatar'), updateProfile);

// Notification preferences
router.get('/notification-preferences', authenticateToken, fetchNotificationPreferences);

// Task routes
router.post('/tasks', authenticateToken, taskController.createTask);
router.get('/tasks', authenticateToken, taskController.getTasksByUser);
router.put('/tasks/:taskId', authenticateToken, taskController.updateTask);
router.delete('/tasks/:taskId', authenticateToken, taskController.deleteTask);

module.exports = router;
