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

// Create a club
const MAX_IMG_SIZE = 16 * 1024 * 1024; // 16 MB in bytes

// Fetch club data including details, members, and discussions
const getClubData = async (req, res) => {
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Query to fetch the club details
        const clubQuery = 'SELECT * FROM clubs WHERE id = ?';
        const club = await queryAsync(clubQuery, [clubId]);
        
        if (club.length === 0) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Query to fetch members of the club
        const membersQuery = `
            SELECT u.id, u.name, cm.status 
            FROM users u
            JOIN club_memberships cm ON cm.user_id = u.id
            WHERE cm.club_id = ?`;
        const members = await queryAsync(membersQuery, [clubId]);

        // Query to fetch discussions related to the club
        const discussionsQuery = 'SELECT * FROM discussions WHERE club_id = ?';
        const discussions = await queryAsync(discussionsQuery, [clubId]);

        // Convert binary image data to base64 for frontend usage
        const formattedClub = {
            ...club[0],
            img: club[0].img ? Buffer.from(club[0].img).toString('base64') : null,
        };

        res.json({
            club: formattedClub,
            members,
            discussions,
        });
    } catch (error) {
        console.error('Error fetching club data:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const createClub = async (req, res) => {
    const { name, img, description, isPrivate } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!name || !description) {
        return res.status(400).json({ error: 'All inputs are required' });
    }

    try {
        // Validate image size
        if (img) {
            const imgBuffer = Buffer.from(img, 'base64');
            if (imgBuffer.length > MAX_IMG_SIZE) {
                return res.status(400).json({ error: 'Image size exceeds 16 MB limit' });
            }
            // Image is valid, proceed with conversion and save
            const result = await queryAsync(
                'INSERT INTO clubs (name, img, description, is_private, created_by) VALUES (?, ?, ?, ?, ?)',
                [name, imgBuffer, description, isPrivate, req.user.id]
            );

            res.status(201).json({ message: 'Club created successfully', clubId: result.insertId });
        } else {
            // If there's no image, insert without an image
            const result = await queryAsync(
                'INSERT INTO clubs (name, description, is_private, created_by) VALUES (?, ?, ?, ?)',
                [name, description, isPrivate, req.user.id]
            );

            res.status(201).json({ message: 'Club created successfully', clubId: result.insertId });
        }
    } catch (error) {
        console.error('Error creating club:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all clubs
const getClubs = async (req, res) => {
  try {
    const userId = req.user.id; // Ensure user is authenticated

    // Fetch clubs and user membership statuses in one query (using LEFT JOIN)
    const clubs = await queryAsync(
      `SELECT c.*, cm.status AS userStatus 
       FROM clubs c
       LEFT JOIN club_memberships cm ON cm.club_id = c.id AND cm.user_id = ?`,
      [userId]
    );

    // Convert binary image data to base64
    const formattedClubs = clubs.map((club) => ({
      ...club,
      img: club.img ? Buffer.from(club.img).toString('base64') : null,
    }));

    res.json(formattedClubs);
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateClub = async (req, res) => {
    const { img, name, description, goals, membershipCriteria, isPrivate } = req.body;
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!name || !description || !goals || !membershipCriteria) {
        return res.status(400).json({ error: 'All inputs are required' });
    }

    try {
        // Convert and validate the image
        let imgBuffer = null;
        if (img) {
            imgBuffer = Buffer.from(img, 'base64');
            if (imgBuffer.length > MAX_IMG_SIZE) {
                return res.status(400).json({ error: 'Image size exceeds 16 MB limit' });
            }
        }

        // Construct query and values dynamically
        let query = `UPDATE clubs SET name = ?, description = ?, goals = ?, membership_criteria = ?, is_private = ?`;
        const values = [name, description, goals, membershipCriteria, isPrivate];

        if (imgBuffer) {
            query += `, img = ?`;
            values.push(imgBuffer);
        }

        query += ` WHERE id = ? AND created_by = ?`;
        values.push(clubId, req.user.id);

        // Execute the query
        const result = await queryAsync(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Club not found or user is not the owner' });
        }

        res.json({ message: 'Club updated successfully' });
    } catch (error) {
        console.error('Error updating club:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete club
const deleteClub = async (req, res) => {
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        const result = await queryAsync(
            'DELETE FROM clubs WHERE id = ? AND created_by = ?',
            [clubId, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Club not found or user is not the owner' });
        }

        res.json({ message: 'Club deleted successfully' });
    } catch (error) {
        console.error('Error deleting club:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Join a club
const joinClub = async (req, res) => {
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if the club exists
        const club = await queryAsync('SELECT id, is_private FROM clubs WHERE id = ?', [clubId]);
        if (club.length === 0) {
            return res.status(404).json({ error: 'Club not found' });
        }

        // Check if the user already has a membership or request status
        const existingMembership = await queryAsync(
            'SELECT id, status FROM club_memberships WHERE user_id = ? AND club_id = ?',
            [req.user.id, clubId]
        );

        if (existingMembership.length > 0) {
            const membershipStatus = existingMembership[0].status;

            if (membershipStatus === 'pending') {
                return res.status(400).json({
                    error: 'Your membership request is still pending. Please wait for approval.'
                });
            }

            return res.status(400).json({ error: 'You are already a member of this club' });
        }

        // If the club is private, send a pending join request
        if (club[0].is_private) {
            await queryAsync(
                'INSERT INTO club_memberships (user_id, club_id, status) VALUES (?, ?, ?)',
                [req.user.id, clubId, 'pending']
            );
            return res.json({ message: 'Join request sent for private club' });
        }

        // If the club is public, directly add the user as a member
        await queryAsync(
            'INSERT INTO club_memberships (user_id, club_id, status) VALUES (?, ?, ?)',
            [req.user.id, clubId, 'approved']
        );

        res.json({ message: 'Successfully joined the club' });
    } catch (error) {
        console.error('Error joining club:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Leave a club
const leaveClub = async (req, res) => {
    const { clubId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if the user is a member of the club
        const result = await queryAsync(
            'SELECT id FROM club_memberships WHERE user_id = ? AND club_id = ?',
            [req.user.id, clubId]
        );
        if (result.length === 0) {
            return res.status(404).json({ error: 'You are not a member of this club' });
        }

        // Remove the user from the club memberships
        await queryAsync(
            'DELETE FROM club_memberships WHERE user_id = ? AND club_id = ?',
            [req.user.id, clubId]
        );

        res.json({ message: 'Successfully left the club' });
    } catch (error) {
        console.error('Error leaving club:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getClubData, createClub, getClubs, updateClub, deleteClub, joinClub, leaveClub };
