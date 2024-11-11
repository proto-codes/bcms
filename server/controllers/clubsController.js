const db = require('../config/db');
const io = require('../server');

// Helper function for Promisified MySQL query
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Get all Clubs
const getClubs = async (req, res) => {
    try {
        const clubs = await queryAsync("SELECT * FROM clubs");
        res.status(200).json(clubs);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch clubs." });
    }
};

// Create a Club
const createClub = async (req, res) => {
    const { name, description, goals, isPrivate } = req.body;
    const createdBy = req.user.id; // Assuming user ID is available in req.user

    try {
        const result = await queryAsync(
            "INSERT INTO clubs (name, description, goals, is_private, created_by) VALUES (?, ?, ?, ?, ?)",
            [name, description, goals, isPrivate, createdBy]
        );
        res.status(201).json({ clubId: result.insertId, message: "Club created successfully!" });
        // Emit real-time updates
        io.emit("clubUpdated", { clubId: result.insertId, message: "New club created!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to create club." });
    }
};

// Join a Club
const joinClub = async (req, res) => {
    const { clubId } = req.params;
    const userId = req.user.id;

    try {
        const [club] = await queryAsync("SELECT is_private FROM clubs WHERE id = ?", [clubId]);
        if (!club) return res.status(404).json({ error: "Club not found." });

        const status = club.is_private ? 'pending' : 'approved';
        
        await queryAsync(
            "INSERT INTO club_memberships (club_id, user_id, status) VALUES (?, ?, ?)",
            [clubId, userId, status]
        );

        res.status(201).json({ message: `Request to join club ${status === 'approved' ? "approved" : "pending"}.` });

        // Emit event if status is pending
        if (status === 'pending') {
            io.emit("membershipUpdated", { clubId, userId, status: 'pending' });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to join club." });
    }
};

// Get Club Overview
const getClubOverview = async (req, res) => {
    const { clubId } = req.params;

    try {
        const [club] = await queryAsync("SELECT * FROM clubs WHERE id = ?", [clubId]);
        if (!club) return res.status(404).json({ error: "Club not found." });

        const members = await queryAsync("SELECT * FROM club_memberships WHERE club_id = ? AND status = 'approved'", [clubId]);
        const events = await queryAsync("SELECT * FROM events WHERE club_id = ?", [clubId]);

        res.json({ club, members, events });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch club overview." });
    }
};

// RSVP to an Event
const rsvpToEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user.id;
    const { status } = req.body; // status can be 'accepted', 'declined', or 'pending'

    try {
        // Check if the event exists
        const [event] = await queryAsync("SELECT * FROM events WHERE id = ?", [eventId]);
        if (!event) return res.status(404).json({ error: "Event not found." });

        // Check if the user has already RSVP'd
        const [existingRsvp] = await queryAsync("SELECT * FROM rsvps WHERE event_id = ? AND user_id = ?", [eventId, userId]);
        
        if (existingRsvp) {
            // Update the RSVP status if the user already exists
            await queryAsync("UPDATE rsvps SET status = ? WHERE event_id = ? AND user_id = ?", [status, eventId, userId]);
            res.status(200).json({ message: `RSVP updated to ${status}.` });
        } else {
            // Insert new RSVP if the user hasn't RSVP'd yet
            await queryAsync(
                "INSERT INTO rsvps (event_id, user_id, status) VALUES (?, ?, ?)",
                [eventId, userId, status]
            );
            res.status(201).json({ message: `RSVP ${status} for the event.` });
        }

        // Emit event for real-time updates
        io.emit("eventRsvpUpdated", { eventId, userId, status });

    } catch (error) {
        res.status(500).json({ error: "Failed to RSVP to event." });
    }
};

module.exports = { getClubs, createClub, joinClub, getClubOverview, rsvpToEvent };
