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

// Fetch user profile (allow viewing other profiles)
const getProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        const userResults = await queryAsync('SELECT name, email FROM users WHERE id = ?', [userId]);
        if (!userResults.length) return res.status(404).json({ error: 'User not found' });

        const profileResults = await queryAsync('SELECT bio, profile_pics, phone_number, birthday, address FROM profile WHERE user_id = ?', [userId]);
        const userProfile = {
            ...userResults[0],
            bio: profileResults[0]?.bio || '',
            profile_pics: profileResults[0]?.profile_pics || '',
            phone_number: profileResults[0]?.phone_number || '',
            birthday: profileResults[0]?.birthday || '',
            address: profileResults[0]?.address || ''
        };

        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile (only allow profile owner to edit)
const updateProfile = async (req, res) => {
    const userId = req.params.userId;

    if (req.user.id !== parseInt(userId)) {
        return res.status(403).json({ error: 'Access forbidden: You can only update your own profile' });
    }

    const { name, email, bio, phone_number, birthday, address } = req.body;
    const profile_pics = req.file ? req.file.path : '';

    try {
        const emailCheckQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
        const emailCheckResult = await queryAsync(emailCheckQuery, [email, userId]);

        if (emailCheckResult.length > 0) {
            return res.status(400).json({ error: 'Email is already in use by another account' });
        }

        await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);

        const profileUpdateQuery = `
            INSERT INTO profile (user_id, bio, profile_pics, phone_number, birthday, address)
            VALUES (?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                bio = VALUES(bio),
                profile_pics = VALUES(profile_pics),
                phone_number = VALUES(phone_number),
                birthday = VALUES(birthday),
                address = VALUES(address)
        `;
        await queryAsync(profileUpdateQuery, [userId, bio, profile_pics, phone_number, birthday, address]);

        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};