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

// Fetch user profile (from users and profile tables)
const getProfile = async (req, res) => {
    // Ensure req.user is defined (from the authenticateToken middleware)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        // Fetch from users table
        const userResults = await queryAsync('SELECT name, email FROM users WHERE id = ?', [req.user.id]);
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch from profile table
        const profileResults = await queryAsync('SELECT bio, profile_pics, phone_number, birthday, address FROM profile WHERE user_id = ?', [req.user.id]);
        const userProfile = {
            ...userResults[0], // name and email
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

// Update user profile (for both users and profile tables)
const updateProfile = async (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const { name, email, bio, phone_number, birthday, address } = req.body;

    // Get the image path
    const profile_pics = req.file ? req.file.path : ''; // Use the uploaded file path

    try {
        // Update users table
        await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.user.id]);

        // Update or insert profile table
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
        await queryAsync(profileUpdateQuery, [req.user.id, bio, profile_pics, phone_number, birthday, address]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};
