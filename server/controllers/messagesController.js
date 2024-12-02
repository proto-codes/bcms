const db = require('../config/db');

// Helper function for Promisified MySQL query
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database Error:', err);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Function to send a message
const sendMessage = async (req, res) => {
    const { senderId, message } = req.body;
    const { receiverId } = req.query;

    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ error: 'Sender, receiver, and message content are required.' });
    }

    try {
        const query = `
            INSERT INTO messages (sender_id, receiver_id, message, created_at)
            VALUES (?, ?, ?, NOW())
        `;
        await queryAsync(query, [senderId, receiverId, message]);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Server error while sending message' });
    }
};

// Function to mark a message as read
const markMessageAsRead = async (req, res) => {
    const { messageId } = req.params;
    const { receiverId } = req.query;

    if (!messageId || !receiverId) {
        return res.status(400).json({ error: 'Message ID and Receiver ID are required' });
    }

    try {
        const query = `
            UPDATE messages 
            SET is_read = TRUE, read_at = NOW() 
            WHERE id = ? AND receiver_id = ? AND is_read = FALSE
        `;
        const result = await queryAsync(query, [messageId, receiverId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found or already read' });
        }

        res.status(200).json({ message: 'Message marked as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ error: 'Server error while marking message as read' });
    }
};

// Function to soft delete a message (mark as deleted)
const deleteMessage = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;

    if (!messageId || !userId) {
        return res.status(400).json({ error: 'Message ID and User ID are required' });
    }

    try {
        const query = `
            UPDATE messages 
            SET deleted_at = NOW() 
            WHERE id = ? AND (sender_id = ? OR receiver_id = ?)
        `;
        const result = await queryAsync(query, [messageId, userId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found or you are not authorized to delete it' });
        }

        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Server error while deleting message' });
    }
};

// Function to edit a message
const editMessage = async (req, res) => {
    const userId = req.user?.id;
    const { messageId } = req.params;
    const { newMessage } = req.body;

    if (!messageId || !userId || !newMessage) {
        return res.status(400).json({ error: 'Message ID, User ID, and new message content are required.' });
    }

    try {
        const query = `
            UPDATE messages 
            SET message = ?, updated_at = NOW()
            WHERE id = ? AND sender_id = ?
        `;
        const result = await queryAsync(query, [newMessage, messageId, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Message not found or you are not authorized to edit it.' });
        }

        res.status(200).json({ message: 'Message updated successfully' });
    } catch (error) {
        console.error('Error editing message:', error);
        res.status(500).json({ error: 'Server error while editing the message' });
    }
};

// Function to fetch all messages for a user (unread messages, etc.)
const getMessages = async (req, res) => {
    const userId = req.user?.id;

    // Validate User ID
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // SQL Query
        const query = `
            SELECT 
                m.id AS message_id,
                m.sender_id,
                m.receiver_id,
                m.message,
                m.created_at,
                m.updated_at,
                m.read_at,
                m.deleted_at,
                m.is_read,
                sender.name AS sender_name,
                receiver.name AS receiver_name,
                sender_profile.profile_pics AS sender_profile_pics,
                receiver_profile.profile_pics AS receiver_profile_pics
            FROM messages m
            JOIN users sender ON m.sender_id = sender.id
            JOIN users receiver ON m.receiver_id = receiver.id
            LEFT JOIN profile sender_profile ON sender.id = sender_profile.user_id
            LEFT JOIN profile receiver_profile ON receiver.id = receiver_profile.user_id
            WHERE 
                (m.receiver_id = ? OR m.sender_id = ?) 
                AND m.deleted_at IS NULL
            ORDER BY m.created_at DESC;
        `;

        // Execute query with parameters
        const messages = await queryAsync(query, [userId, userId]);

        // Convert profile pictures to Base64
        const formattedMessages = messages.map((message) => ({
            ...message,
            sender_profile_pics: message.sender_profile_pics
                ? Buffer.from(message.sender_profile_pics).toString('base64')
                : null,
            receiver_profile_pics: message.receiver_profile_pics
                ? Buffer.from(message.receiver_profile_pics).toString('base64')
                : null,
        }));

        // Send response
        res.status(200).json({ messages: formattedMessages });
    } catch (error) {
        console.error('Error fetching messages:', error.message, error.stack);
        res.status(500).json({ error: 'Server error while fetching messages.' });
    }
};

const getMessagesForReceiver = async (req, res) => {
    const userId = req.user?.id, { receiverId } = req.query;
    if (!userId || isNaN(userId) || !receiverId || isNaN(receiverId))
        return res.status(400).json({ error: 'Valid User and Receiver IDs are required.' });

    try {
        const query = `
            SELECT 
                receiver.id AS receiver_id, receiver.name AS receiver_name, 
                receiver_profile.profile_pics AS receiver_profile_pics,
                m.id AS message_id, m.sender_id, m.receiver_id, m.message, 
                m.created_at, m.updated_at, m.read_at, m.is_read
            FROM users receiver
            LEFT JOIN profile receiver_profile ON receiver.id = receiver_profile.user_id
            LEFT JOIN messages m 
                ON ((m.sender_id = ? AND m.receiver_id = receiver.id) 
                OR (m.sender_id = receiver.id AND m.receiver_id = ?)) 
                AND m.deleted_at IS NULL
            WHERE receiver.id = ? ORDER BY m.created_at DESC;`;

        const rows = await queryAsync(query, [userId, userId, receiverId]);

        const receiverDetails = rows.length > 0 || rows[0]?.receiver_id === receiverId
            ? {
                receiver_id: receiverId,
                receiver_name: rows[0]?.receiver_name || 'Unknown User',
                receiver_profile_pics: rows[0]?.receiver_profile_pics 
                    ? Buffer.from(rows[0].receiver_profile_pics).toString('base64') 
                    : null
            } : null;

        const messages = rows.filter(r => r.message_id).map(r => ({
            message_id: r.message_id, sender_id: r.sender_id, receiver_id: r.receiver_id, 
            message: r.message, created_at: r.created_at, updated_at: r.updated_at, 
            read_at: r.read_at, is_read: r.is_read
        }));

        console.log(receiverDetails, messages)

        res.status(200).json({ ...receiverDetails, messages });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Server error while fetching messages.' });
    }
};

module.exports = {
    sendMessage,
    markMessageAsRead,
    deleteMessage,
    editMessage,
    getMessages,
    getMessagesForReceiver,
};
