const express = require('express');
const { getUserDetails, fetchNotificationPreferences } = require('../controllers/userController');
// const { getProfile, updateProfile } = require('../controllers/profileController');
const authenticateToken = require('../middleware/auth');
// const upload = require('../config/multer');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Get user details
router.get('/user', authenticateToken, getUserDetails);

// Get user profile
// router.get('/profile', authenticateToken, getProfile);

// Update user profile
// router.put('/profile', authenticateToken, upload.single('avatar'), updateProfile);

// Fetch notification preferences
router.get('/notification-preferences', authenticateToken, fetchNotificationPreferences);

// Route to create a task
router.post('/task', taskController.createTask);

// Route to get all tasks for a user
router.get('/task/:userId', authenticateToken, taskController.getTasksByUser);

// Route to get a single task by ID
router.get('/task/:userId/:taskId', authenticateToken, taskController.getTaskById);

// Route to update a task
router.put('/task/:taskId', authenticateToken, taskController.updateTask);

// Route to delete a task
router.delete('/task/:taskId', authenticateToken, taskController.deleteTask);

module.exports = router;
