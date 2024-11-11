const db = require('../config/db');

// Helper function for Promisified MySQL query
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fetch all events
const getAllEvents = async (req, res) => {
  const userId = req.user.id; // Get the logged-in user's ID

  try {
    const rows = await queryAsync(`
      SELECT events.*, events.user_id AS ownerId, rsvps.rsvp AS user_rsvp
      FROM events
      LEFT JOIN rsvps ON events.id = rsvps.event_id AND rsvps.user_id = ?
    `, [userId]);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load events' });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  const user_id = req.user.id; // Get the logged-in user's ID from the token

  // Validate required fields
  if (!title || !date || !location || !description) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure the date format is correct for MySQL DATETIME type
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  try {
    const result = await queryAsync(
      'INSERT INTO events (user_id, title, date, location, description) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, formattedDate, location, description]
    );
    res.status(201).json({ id: result.insertId, user_id, title, date: formattedDate, location, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create event' });
  }
};

// Update an existing event
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;
  const user_id = req.user.id; // Get the logged-in user's ID from the token

  // Validate required fields
  if (!title || !date || !location || !description) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  // Ensure the date format is correct for MySQL DATETIME type
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  try {
    const result = await queryAsync(
      'UPDATE events SET title = ?, date = ?, location = ?, description = ? WHERE id = ? AND user_id = ?',
      [title, formattedDate, location, description, id, user_id] // Add user_id in WHERE clause to ensure the user can only update their own event
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or you are not authorized to update this event' });
    }
    res.status(200).json({ id, title, date: formattedDate, location, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id; // Get the logged-in user's ID from the token

  try {
    const result = await queryAsync('DELETE FROM events WHERE id = ? AND user_id = ?', [id, user_id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or you are not authorized to delete this event' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete event' });
  }
};

// RSVP an event (toggle RSVP status)
const toggleRSVP = async (req, res) => {
  const { id: eventId } = req.params;
  const userId = req.user.id; // Assuming `req.user` holds the logged-in user's info

  try {
    // Check if the user has already RSVP'd for this event
    const rows = await queryAsync('SELECT rsvp FROM rsvps WHERE event_id = ? AND user_id = ?', [eventId, userId]);
    
    if (rows.length > 0) {
      // If RSVP exists, toggle it
      const currentRSVPStatus = rows[0].rsvp;
      const newRSVPStatus = !currentRSVPStatus;

      await queryAsync('UPDATE rsvps SET rsvp = ? WHERE event_id = ? AND user_id = ?', [newRSVPStatus, eventId, userId]);
      res.status(200).json({ message: `RSVP ${newRSVPStatus ? 'confirmed' : 'canceled'}` });
    } else {
      // If no RSVP exists, create a new one
      await queryAsync('INSERT INTO rsvps (event_id, user_id, rsvp) VALUES (?, ?, TRUE)', [eventId, userId]);
      res.status(201).json({ message: 'RSVP confirmed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update RSVP status' });
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleRSVP,
};
