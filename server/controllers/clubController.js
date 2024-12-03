const { queryAsync } = require('../config/db');

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
            SELECT u.id, u.name, cm.status, cm.role
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
        let clubId;

        // Validate image size
        if (img) {
            const imgBuffer = Buffer.from(img, 'base64');
            if (imgBuffer.length > MAX_IMG_SIZE) {
                return res.status(400).json({ error: 'Image size exceeds 16 MB limit' });
            }

            // Insert club with image
            const result = await queryAsync(
                'INSERT INTO clubs (name, img, description, is_private, created_by) VALUES (?, ?, ?, ?, ?)',
                [name, imgBuffer, description, isPrivate, req.user.id]
            );
            clubId = result.insertId;
        } else {
            // Insert club without image
            const result = await queryAsync(
                'INSERT INTO clubs (name, description, is_private, created_by) VALUES (?, ?, ?, ?)',
                [name, description, isPrivate, req.user.id]
            );
            clubId = result.insertId;
        }

        // Insert creator as admin in club_memberships table
        await queryAsync(
            'INSERT INTO club_memberships (user_id, club_id, role, status) VALUES (?, ?, ?, ?)',
            [req.user.id, clubId, 'admin', 'approved']
        );

        res.status(201).json({ message: 'Club created successfully', clubId });
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

    // Convert `isPrivate` into a consistent format
    const isPrivateVal = isPrivate === true || isPrivate === 'true' || isPrivate === 1;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!name || !description || !goals || !membershipCriteria) {
        return res.status(400).json({ error: 'All inputs are required' });
    }

    try {
        // Initialize image buffer as null
        let imgBuffer = null;

        // Process the image if provided
        if (img) {
            try {
                imgBuffer = Buffer.from(img, 'base64');
                if (imgBuffer.length > MAX_IMG_SIZE) {
                    return res.status(400).json({ error: 'Image size exceeds 16 MB limit' });
                }
            } catch (err) {
                console.error('Invalid image format:', err);
                return res.status(400).json({ error: 'Invalid image format' });
            }
        }

        // Construct the query for updating the club
        let query = `
            UPDATE clubs
            SET name = ?, description = ?, goals = ?, membership_criteria = ?, is_private = ?`;
        const values = [name, description, goals, membershipCriteria, isPrivateVal];

        // If an image was provided, include the image in the update query
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

const createDiscussion = async (req, res) => {
    const { clubId } = req.params;
    const { title, content } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!clubId || !title || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await queryAsync(
            'INSERT INTO discussions (title, content, club_id, created_by) VALUES (?, ?, ?, ?)',
            [title, content, clubId, req.user.id]
        );

        res.status(201).json({
            message: 'Discussion created successfully',
            discussion: { id: result.insertId, title, content },
        });
    } catch (error) {
        console.error('Error creating discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const editDiscussion = async (req, res) => {
    const { clubId, discussionId } = req.params;
    const { title, content } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    try {
        // Check if the discussion exists and get the creator's ID
        const discussionQuery = 'SELECT * FROM discussions WHERE id = ? AND club_id = ?';
        const discussion = await queryAsync(discussionQuery, [discussionId, clubId]);

        if (discussion.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const discussionCreatorId = discussion[0].created_by;

        // Check if the user is the creator or an admin
        const isAdminQuery = 'SELECT role FROM club_memberships WHERE user_id = ? AND club_id = ?';
        const adminCheck = await queryAsync(isAdminQuery, [req.user.id, clubId]);

        if (req.user.id !== discussionCreatorId && !adminCheck.some(member => member.role === 'admin')) {
            return res.status(403).json({ error: 'You are not authorized to edit this discussion' });
        }

        // Update the discussion
        const updateQuery = 'UPDATE discussions SET title = ?, content = ? WHERE id = ?';
        await queryAsync(updateQuery, [title, content, discussionId]);

        res.json({ message: 'Discussion updated successfully' });
    } catch (error) {
        console.error('Error editing discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteDiscussion = async (req, res) => {
    const { clubId, discussionId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if the discussion exists and get the creator's ID
        const discussionQuery = 'SELECT * FROM discussions WHERE id = ? AND club_id = ?';
        const discussion = await queryAsync(discussionQuery, [discussionId, clubId]);

        if (discussion.length === 0) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const discussionCreatorId = discussion[0].created_by;

        // Check if the user is the creator or an admin
        const isAdminQuery = 'SELECT role FROM club_memberships WHERE user_id = ? AND club_id = ?';
        const adminCheck = await queryAsync(isAdminQuery, [req.user.id, clubId]);

        if (req.user.id !== discussionCreatorId && !adminCheck.some(member => member.role === 'admin')) {
            return res.status(403).json({ error: 'You are not authorized to delete this discussion' });
        }

        // Delete the discussion
        const deleteQuery = 'DELETE FROM discussions WHERE id = ?';
        await queryAsync(deleteQuery, [discussionId]);

        res.json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error('Error deleting discussion:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a member to a club by name
const addMember = async (req, res) => {
    const { clubId } = req.params;
    const { name, role } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!name || !role) {
        return res.status(400).json({ error: 'User name and role are required' });
    }

    try {
        // Validate role
        const validRoles = ['member', 'club leader', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: `Invalid role. Valid roles are: ${validRoles.join(', ')}` });
        }

        // Check if the user exists
        const userQuery = 'SELECT id FROM users WHERE name = ?';
        const user = await queryAsync(userQuery, [name]);

        if (user.length === 0) {
            return res.status(404).json({ error: `User '${name}' not found` });
        }

        const userId = user[0].id;

        // Check if the user is already a member
        const membershipQuery = 'SELECT * FROM club_memberships WHERE user_id = ? AND club_id = ?';
        const existingMembership = await queryAsync(membershipQuery, [userId, clubId]);

        if (existingMembership.length > 0) {
            return res.status(400).json({ error: `User '${name}' is already a member of the club` });
        }

        // Add user to the club
        const addMemberQuery = `
            INSERT INTO club_memberships (club_id, user_id, status, role)
            VALUES (?, ?, ?, ?)`;
        await queryAsync(addMemberQuery, [clubId, userId, 'approved', role]);

        res.status(201).json({ message: `User '${name}' added to the club successfully` });
    } catch (error) {
        console.error(`Error adding member '${name}' to club '${clubId}':`, error);
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
};

// Fetch all discussion messages
const getDiscussionMessages = async (req, res) => {
    const { discussionId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Query to fetch discussion details
        const discussionQuery = `
            SELECT title, content 
            FROM discussions 
            WHERE id = ?
        `;
        const [discussionDetails] = await queryAsync(discussionQuery, [discussionId]);

        if (!discussionDetails) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        // Query to fetch discussion messages
        const messagesQuery = `
            SELECT dm.id, dm.content, dm.timestamp, u.id AS sender_id, u.name AS sender_name
            FROM discussion_messages dm
            JOIN users u ON dm.sender_id = u.id
            WHERE dm.discussion_id = ?
            ORDER BY dm.timestamp ASC
        `;
        const messages = await queryAsync(messagesQuery, [discussionId]);

        res.json({ discussionDetails, messages });
    } catch (error) {
        console.error('Error fetching discussion messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Send a new message to a discussion
const createDiscussionMessage = async (req, res) => {
    const { discussionId } = req.params;
    const { content } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!content) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    try {
        // Insert new message into the database
        const result = await queryAsync(
            'INSERT INTO discussion_messages (discussion_id, sender_id, content) VALUES (?, ?, ?)',
            [discussionId, req.user.id, content]
        );

        res.status(201).json({
            message: {
                id: result.insertId,
                content,
                sender_id: req.user.id,
                sender_name: req.user.name,
                timestamp: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a user's message from a discussion
const deleteDiscussionMessage = async (req, res) => {
    const { discussionId, messageId } = req.params;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Check if the message exists and if the user is the sender
        const checkQuery = `
            SELECT id FROM discussion_messages
            WHERE id = ? AND discussion_id = ? AND sender_id = ?
        `;
        const message = await queryAsync(checkQuery, [messageId, discussionId, req.user.id]);

        if (message.length === 0) {
            return res.status(403).json({ error: 'You are not authorized to delete this message or it does not exist' });
        }

        // Delete the message
        const deleteQuery = 'DELETE FROM discussion_messages WHERE id = ?';
        await queryAsync(deleteQuery, [messageId]);

        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Error deleting discussion message:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getClubData, createClub, getClubs, updateClub, deleteClub, joinClub, leaveClub, createDiscussion, editDiscussion, deleteDiscussion, addMember, getDiscussionMessages, createDiscussionMessage, deleteDiscussionMessage };
