const db = require('../config/db');

const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const getUserDetails = async (req, res) => {
    try {
        const results = await queryAsync('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getUserDetails };
