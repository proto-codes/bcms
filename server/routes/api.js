const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const taskController = require('../controllers/taskController');
const searchController = require('../controllers/searchController');
const messagesController = require('../controllers/messagesController');
const eventController = require('../controllers/eventController');
const notificationsController = require('../controllers/notificationsController');
const clubController = require('../controllers/clubController');
const upload = require('../config/multer');

const router = express.Router();

// Logout Route
router.post('/logout', authController.logout);

// Token verification
router.get('/verify-account', authController.verifyAccount);
router.post('/request-verification-token', authController.requestVerificationToken);

// Token validation route
router.post('/validate-token', (req, res) => {
  res.json({ valid: true, user: req.user });
});

// User settings routes
router.put('/change-password', userController.changePassword);
router.put('/notification-preferences', userController.updateNotificationPreferences);
router.delete('/delete-account', userController.deleteAccount);

// User routes
router.get('/user', userController.getUserDetails);

// Profile routes
router.get('/profile/:userId', profileController.getProfile);
router.put('/profile/:userId', upload.single('profile_pics'), profileController.updateProfile);

// Notification preferences
router.get('/notification-preferences', userController.fetchNotificationPreferences);

// Task routes
router.post('/tasks', taskController.createTask);
router.get('/tasks', taskController.getTasksByUser);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

// Search route
router.get('/search', searchController.searchUsers);

// Messaging routes
router.get('/conversations', messagesController.fetchConversations);
router.get('/conversations/:conversationId/messages', messagesController.fetchMessages);
router.post('/messages', messagesController.sendMessage);
router.put('/messages/:messageId/read', messagesController.updateMessageStatus);
router.delete('/messages/:messageId', messagesController.deleteMessage);

// Notifications route
router.get('/notifications', notificationsController.getNotifications);
router.delete('/notifications/:id', notificationsController.deleteNotification);

// Get club data by clubId
router.get('/clubs/:clubId', clubController.getClubData);
// Club Routes
router.post('/clubs', clubController.createClub);
router.get('/clubs', clubController.getClubs);
router.put('/clubs/:clubId', clubController.updateClub);
router.delete('/clubs/:clubId', clubController.deleteClub);
router.post('/clubs/:clubId/join', clubController.joinClub);
router.post('/clubs/:clubId/leave', clubController.leaveClub);

// Event Routes
router.post('/events', eventController.createEvent);
router.get('/events', eventController.getAllEvents);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.put('/events/rsvp/:id', eventController.toggleRSVP);

module.exports = router;
