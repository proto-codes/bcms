const { queryAsync } = require('../config/db');

// Create an event
const createEvent = async (req, res) => {
    const { title, description, date, location, startTime, endTime } = req.body;
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!title || !description || !date || !location || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!clubId) {
        return res.status(400).json({ error: 'ClubId is required' });
    }

    try {
        // Validate that the club exists
        const [club] = await queryAsync('SELECT * FROM clubs WHERE id = ?', [clubId]);
        if (!club) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Insert the event
        const result = await queryAsync(
            'INSERT INTO events (title, description, date, location, club_id, start_time, end_time, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, description, date, location, clubId, startTime, endTime, req.user.id]
        );

        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all events for a specific club
const getAllEvents = async (req, res) => {
    const { clubId } = req.params; // Get the clubId from the URL parameter

    if (!clubId) {
        return res.status(400).json({ error: 'clubId is required' });
    }

    try {
        // Query to get events for a specific clubId
        const events = await queryAsync('SELECT * FROM events WHERE club_id = ?', [clubId]);

        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update event details
const updateEvent = async (req, res) => {
    const { title, description, date, location, startTime, endTime } = req.body;
    const { id } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!title || !description || !date || !location || !startTime || !endTime) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (!id) {
        return res.status(400).json({ error: 'Id is required' });
    }

    try {
        const result = await queryAsync(
            'UPDATE events SET title = ?, description = ?, date = ?, location = ?, start_time = ?, end_time = ? WHERE id = ? AND created_by = ?',
            [title, description, date, location, startTime, endTime, id, req.user.id]
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
    const { id: eventId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if the event exists
        const [event] = await queryAsync('SELECT * FROM events WHERE id = ?', [eventId]);
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if the user has already RSVP'd
        const [existingRSVP] = await queryAsync(
            'SELECT * FROM rsvps WHERE user_id = ? AND event_id = ?',
            [req.user.id, eventId]
        );

        if (existingRSVP) {
            // If an RSVP exists, cancel it
            await queryAsync('DELETE FROM rsvps WHERE user_id = ? AND event_id = ?', [req.user.id, eventId]);
            return res.json({ message: 'RSVP canceled' });
        } else {
            // If no RSVP exists, add a new one
            await queryAsync('INSERT INTO rsvps (event_id, user_id) VALUES (?, ?)', [eventId, req.user.id]);
            return res.json({ message: 'RSVP confirmed' });
        }
    } catch (error) {
        console.error('Error toggling RSVP:', error);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = { createEvent, getAllEvents, updateEvent, deleteEvent, toggleRSVP };
