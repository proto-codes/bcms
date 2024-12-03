const { queryAsync } = require('../config/db');

// Fetch notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await queryAsync(
      'SELECT id, message, type, date FROM notifications WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    res.status(200).json(notifications.length ? notifications : []);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new notification
const createNotification = ({ user_id, message, type }) => {
  return new Promise((resolve, reject) => {
    const date = new Date();
    db.query(
      'INSERT INTO notifications (user_id, message, type, date) VALUES (?, ?, ?, ?)',
      [user_id, message, type, date],
      (error) => {
        if (error) {
          console.error('Error creating notification in database:', error);
          return reject(new Error('Error creating notification'));
        }
        resolve('Notification created');
      }
    );
  });
};

// Delete a notification by ID
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await queryAsync(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  deleteNotification,
};
