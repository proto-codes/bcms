const { queryAsync } = require('../config/db');
const bcrypt = require('bcryptjs');

const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!req.user?.id) return res.status(401).json({ error: 'User not authenticated' });

    try {
        const [{ password }] = await queryAsync('SELECT password FROM users WHERE id = ?', [req.user.id]);
        if (!password) return res.status(404).json({ error: 'User not found' });
        if (await bcrypt.compare(newPassword, password)) return res.status(400).json({ error: 'New password cannot be the same as the old' });
        if (!(await bcrypt.compare(currentPassword, password))) return res.status(401).json({ error: 'Incorrect current password' });

        await queryAsync('UPDATE users SET password = ? WHERE id = ?', [await bcrypt.hash(newPassword, 10), req.user.id]);
        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const updateNotificationPreferences = async (req, res) => {
    const { emailNotifications, smsNotifications } = req.body;
    if (!req.user?.id) return res.status(401).json({ error: 'User not authenticated' });
    if (!emailNotifications && !smsNotifications) return res.status(400).json({ error: 'At least one preference must be selected' });

    try {
        await queryAsync('UPDATE users SET email_notifications = ?, sms_notifications = ? WHERE id = ?', [emailNotifications, smsNotifications, req.user.id]);
        res.json({ message: 'Notification preferences updated' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const fetchNotificationPreferences = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ error: 'User not authenticated' });

    try {
        const [preferences] = await queryAsync('SELECT email_notifications, sms_notifications FROM users WHERE id = ?', [req.user.id]);
        if (!preferences) return res.status(404).json({ error: 'Notification preferences not found' });
        res.json(preferences);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteAccount = async (req, res) => {
    if (!req.user?.id) return res.status(401).json({ error: 'User not authenticated' });

    try {
        await queryAsync('DELETE FROM users WHERE id = ?', [req.user.id]);
        res.json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { changePassword, updateNotificationPreferences, fetchNotificationPreferences, deleteAccount };
