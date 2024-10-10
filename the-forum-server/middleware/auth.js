const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware to authenticate token and check if it has been invalidated
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

    if (!token) {
        return res.sendStatus(401); // No token, unauthorized
    }

    // Check if the token is in the active_tokens table
    db.query('SELECT * FROM active_tokens WHERE token = ?', [token], (err, results) => {
        if (err) return res.status(500).send('Server error');
        if (results.length === 0) return res.sendStatus(403); // Token has been invalidated

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Invalid token, forbidden
            }
            req.user = user;
            next();
        });
    });
};

module.exports = authenticateToken;
