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

const router = express.Router();

// Logout Route
router.post('/logout', authController.logout);

// Token verification
router.get('/verify-account', authController.verifyAccount);
router.post('/request-verification-token', authController.requestVerificationToken);

// Token validation route
router.post('/validate-token', (req, res) => {
  const newAccessToken = req.newAccessToken;
  if (newAccessToken) {
    return res.status(200).json({ id: req.user.id, newAccessToken });
  }
  res.status(200).json({ user: req.user });
});

// User settings routes
router.put('/change-password', userController.changePassword);
router.put('/notification-preferences', userController.updateNotificationPreferences);
router.delete('/delete-account', userController.deleteAccount);

// User routes
router.get('/user', userController.getUserDetails);

// Profile routes
router.get('/profile/:userId', profileController.getProfile);
router.put('/profile/:userId', profileController.updateProfile);

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
router.post('/messages', messagesController.sendMessage);
router.put('/messages/:messageId/read', messagesController.markMessageAsRead);
router.delete('/messages/:messageId/delete', messagesController.deleteMessage);
router.put('/messages/:messageId/edit', messagesController.editMessage);
router.get('/messages', messagesController.getMessages);
router.get('/messages/receiver', messagesController.getMessagesForReceiver);

// Notifications route
router.get('/notifications', notificationsController.getNotifications);
router.delete('/notifications/:id', notificationsController.deleteNotification);

// Club Routes
router.get('/clubs/:clubId', clubController.getClubData);
router.post('/clubs', clubController.createClub);
router.get('/clubs', clubController.getClubs);
router.put('/clubs/:clubId', clubController.updateClub);
router.delete('/clubs/:clubId', clubController.deleteClub);
router.post('/clubs/:clubId/join', clubController.joinClub);
router.post('/clubs/:clubId/leave', clubController.leaveClub);
router.post('/clubs/:clubId/add-member', clubController.addMember);

// Discussion Routes
router.post('/clubs/:clubId/discussions', clubController.createDiscussion);
router.put('/clubs/:clubId/discussions/:discussionId', clubController.editDiscussion);
router.delete('/clubs/:clubId/discussions/:discussionId', clubController.deleteDiscussion);
router.get('/discussion/:discussionId', clubController.getDiscussionMessages);
router.post('/discussion/:discussionId', clubController.createDiscussionMessage);
router.delete('/discussion/:discussionId/:messageId', clubController.deleteDiscussionMessage);

// Event Routes
router.post('/events/:clubId', eventController.createEvent);
router.get('/events/:clubId', eventController.getAllEvents);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
router.post('/events/:id/rsvp', eventController.toggleRSVP);

module.exports = router;
