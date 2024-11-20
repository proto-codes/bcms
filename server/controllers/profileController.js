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
        // Fetch basic user details (name, email)
        const userResults = await queryAsync('SELECT name, email FROM users WHERE id = ?', [userId]);
        if (!userResults.length) return res.status(404).json({ error: 'User not found' });

        // Fetch the user profile details (bio, profile_pics, phone_number, birthday, address)
        const profileResults = await queryAsync('SELECT bio, profile_pics, phone_number, birthday, address FROM profile WHERE user_id = ?', [userId]);

        // Format the profile data
        const userProfile = {
            ...userResults[0],
            bio: profileResults[0]?.bio || '',
            profile_pics: profileResults[0]?.profile_pics 
                ? Buffer.from(profileResults[0].profile_pics).toString('base64') // Convert binary image to base64
                : null,
            phone_number: profileResults[0]?.phone_number || '',
            birthday: profileResults[0]?.birthday || '',
            address: profileResults[0]?.address || ''
        };

        // Return the formatted profile data with base64 image
        res.json(userProfile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update user profile (only allow profile owner to edit)
const updateProfile = async (req, res) => {
    const userId = req.params.userId;

    // Authorization check
    if (req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ error: 'Access forbidden: You can only update your own profile' });
    }

    const { name, email, bio, profile_pics, phone_number, birthday, address } = req.body;

    // Check if required fields are provided
    if (!name || !email || !bio || !phone_number || !birthday || !address) {
        return res.status(400).json({ error: 'All fields except profile picture are required' });
    }

    try {
        // Check if email is already in use
        const emailCheckQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';
        const emailCheckResult = await queryAsync(emailCheckQuery, [email, userId]);

        if (emailCheckResult.length > 0) {
            return res.status(400).json({ error: 'Email is already in use by another account' });
        }

        // Update user table for basic info
        await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);

        // Validate and process profile picture if provided
        let processedProfilePics = null;
        if (profile_pics) {
            try {
                const imgBuffer = Buffer.from(profile_pics, 'base64');

                // Check image size (16MB limit)
                const MAX_IMG_SIZE = 16 * 1024 * 1024; // 16 MB
                if (imgBuffer.length > MAX_IMG_SIZE) {
                    return res.status(400).json({ error: 'Profile picture size exceeds the 16 MB limit' });
                }

                // If valid, keep the processed image buffer or store it elsewhere
                processedProfilePics = imgBuffer;
            } catch (error) {
                return res.status(400).json({ error: 'Invalid profile picture format' });
            }
        }

        // Update or insert into profile table
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
        await queryAsync(profileUpdateQuery, [
            userId,
            bio || null,
            processedProfilePics,
            phone_number || null,
            birthday || null,
            address || null,
        ]);

        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};