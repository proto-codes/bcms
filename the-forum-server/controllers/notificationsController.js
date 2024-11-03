const db = require('../config/db');

// Fetch notifications for the logged-in user
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    // Query to fetch notifications
    db.query(
      'SELECT id, message, type, date FROM notifications WHERE user_id = ? ORDER BY date DESC',
      [userId],
      (error, results) => {
        if (error) {
          console.error('Error fetching notifications:', error);
          return res.status(500).json({ error: 'Internal server error' });
        }
        
        if (results.length === 0) {
          return res.status(200).json({ message: 'No notifications found' });
        }
        
        res.status(200).json(results);
      }
    );
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to create a new notification
const createNotification = (req, res) => {
  const { message, type } = req.body;

  if (!message || !type) {
    return res.status(400).json({ error: 'Message and type are required' });
  }

  const userId = req.user.id;
  const date = new Date();

  // Insert new notification into the database
  db.query(
    'INSERT INTO notifications (user_id, message, type, date) VALUES (?, ?, ?, ?)',
    [userId, message, type, date],
    (error) => {
      if (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      res.status(201).json({ message: 'Notification created successfully!' });
    }
  );
};

module.exports = {
  getNotifications,
  createNotification,
};
