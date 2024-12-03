const { queryAsync } = require('../config/db');

const getProfile = async (req, res) => {
    const userId = req.params.userId;

    try {
        const query = `
            SELECT u.name, u.email, p.bio, p.profile_pics, p.phone_number, p.birthday, p.address
            FROM users u
            LEFT JOIN profile p ON u.id = p.user_id
            WHERE u.id = ?
        `;
        const results = await queryAsync(query, [userId]);

        if (!results.length) return res.status(404).json({ error: 'User not found' });

        const user = results[0];
        res.json({
            name: user.name,
            email: user.email,
            bio: user.bio || '',
            profile_pics: user.profile_pics
                ? Buffer.from(user.profile_pics).toString('base64')
                : null,
            phone_number: user.phone_number || '',
            birthday: user.birthday || '',
            address: user.address || '',
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.params.userId;
    if (req.user.id !== parseInt(userId, 10)) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { name, email, bio, profile_pics, phone_number, birthday, address } = req.body;
    if (!name || !email || !bio || !phone_number || !birthday || !address) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const emailCheck = await queryAsync('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
        if (emailCheck.length) return res.status(400).json({ error: 'Email already in use' });

        await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);

        let profileImage = null;
        if (profile_pics) {
            const imgBuffer = Buffer.from(profile_pics, 'base64');
            if (imgBuffer.length > 16 * 1024 * 1024) {
                return res.status(400).json({ error: 'Profile picture too large' });
            }
            profileImage = imgBuffer;
        }

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
        await queryAsync(profileUpdateQuery, [userId, bio, profileImage, phone_number, birthday, address]);

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { getProfile, updateProfile };
