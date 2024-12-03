const jwt = require('jsonwebtoken');
const { queryAsync } = require('../config/db');

const generateTokens = (userId) => {
    const newAccessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
    const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    return { newAccessToken, newRefreshToken, newExpiresAt };
};

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const accessToken = authHeader?.split(' ')[1];

    if (!accessToken) return res.status(401).json({ error: 'Access token is missing' });

    try {
        const user = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = user;

        const userData = await queryAsync(
            `
            SELECT p.profile_pics
            FROM users u
            LEFT JOIN profile p ON u.id = p.user_id
            WHERE u.id = ?`,
            [user.id]
        );

        req.user.profile_pics = userData[0]?.profile_pics
            ? Buffer.from(userData[0].profile_pics).toString('base64')
            : null;

        return next();
    } catch (err) {
        if (err.name !== 'TokenExpiredError') return res.status(403).json({ error: 'Token is invalid' });

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required' });

        try {
            const { id: userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            const results = await queryAsync(
                `
                SELECT * FROM active_tokens WHERE user_id = ? AND refresh_token = ? AND expires_at > UTC_TIMESTAMP()`,
                [userId, refreshToken.trim()]
            );

            if (!results.length) return res.status(403).json({ error: 'Invalid or expired refresh token' });

            const { newAccessToken, newRefreshToken, newExpiresAt } = generateTokens(userId);

            await queryAsync(
                `
                UPDATE active_tokens SET refresh_token = ?, expires_at = ? WHERE user_id = ?`,
                [newRefreshToken, newExpiresAt, userId]
            );

            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
                maxAge: 30 * 24 * 60 * 60 * 1000,
                path: '/',
            });

            req.user = { id: userId };
            req.newAccessToken = newAccessToken;
            return next();
        } catch (refreshErr) {
            console.error('Error refreshing token:', refreshErr);
            return res.status(403).json({ error: 'Invalid or expired refresh token' });
        }
    }
};

module.exports = authenticateToken;
