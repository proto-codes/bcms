const db = require('../config/db'); // Adjust the path to your database config

// Fetch all conversations for a user
const fetchConversations = async (req, res) => {
    const userId = req.user.id; // Assuming you have the user ID from authentication

    const query = `
        SELECT DISTINCT m.sender_id, m.receiver_id, 
            CASE 
                WHEN m.sender_id = ? THEN m.receiver_id 
                ELSE m.sender_id 
            END AS other_user_id
        FROM messages m
        WHERE m.sender_id = ? OR m.receiver_id = ?`;

    db.query(query, [userId, userId, userId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database error", error });
        }
        res.status(200).json(results);
    });
};

// Fetch messages for a specific conversation
const fetchMessages = async (req, res) => {
    const { conversationId } = req.params;

    const query = `
        SELECT * FROM messages 
        WHERE (sender_id = ? OR receiver_id = ?) 
        AND (sender_id = ? OR receiver_id = ?) 
        ORDER BY created_at ASC`;

    db.query(query, [conversationId, conversationId, conversationId, conversationId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database error", error });
        }
        res.status(200).json(results);
    });
};

// Send a new message
const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;

    const query = `INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)`;

    db.query(query, [sender_id, receiver_id, message], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database error", error });
        }
        res.status(201).json({ message: "Message sent successfully", messageId: results.insertId });
    });
};

// Update message status (mark as read)
const updateMessageStatus = async (req, res) => {
    const { messageId } = req.params;

    const query = `UPDATE messages SET is_read = TRUE, read_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(query, [messageId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database error", error });
        }
        res.status(200).json({ message: "Message marked as read" });
    });
};

// Delete a message (soft delete)
const deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    const query = `UPDATE messages SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`;

    db.query(query, [messageId], (error, results) => {
        if (error) {
            return res.status(500).json({ message: "Database error", error });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    });
};

module.exports = {
    fetchConversations,
    fetchMessages,
    sendMessage,
    updateMessageStatus,
    deleteMessage,
};
