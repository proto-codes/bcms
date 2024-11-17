const db = require('../config/db');

// Helper function to query the database
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Create an event
const createEvent = async (req, res) => {
    const { name, date, location, clubId } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const result = await queryAsync(
            'INSERT INTO events (name, date, location, club_id, created_by) VALUES (?, ?, ?, ?, ?)',
            [name, date, location, clubId, req.user.id]
        );
        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await queryAsync('SELECT * FROM events');
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update event details
const updateEvent = async (req, res) => {
    const { name, date, location } = req.body;
    const { id } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const result = await queryAsync(
            'UPDATE events SET name = ?, date = ?, location = ? WHERE id = ? AND created_by = ?',
            [name, date, location, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found or user is not the creator' });
        }

        res.json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const result = await queryAsync(
            'DELETE FROM events WHERE id = ? AND created_by = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found or user is not the creator' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// RSVP to an event
const toggleRSVP = async (req, res) => {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const [rsvp] = await queryAsync(
            'SELECT * FROM event_rsvps WHERE user_id = ? AND event_id = ?',
            [req.user.id, id]
        );

        if (rsvp) {
            await queryAsync('DELETE FROM event_rsvps WHERE user_id = ? AND event_id = ?', [req.user.id, id]);
            res.json({ message: 'RSVP canceled' });
        } else {
            await queryAsync('INSERT INTO event_rsvps (user_id, event_id) VALUES (?, ?)', [req.user.id, id]);
            res.json({ message: 'RSVP confirmed' });
        }
    } catch (error) {
        console.error('Error toggling RSVP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, toggleRSVP };
