const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { queryAsync } = require('../config/db');
const { createNotification } = require('./notificationsController');

// Helper function to send email
const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    });
};

// Helper function to generate JWT
const generateToken = (user, secret, expiresIn) => {
    return jwt.sign({ id: user.id, name: user.name, email: user.email }, secret, { expiresIn });
};

// Register user
const register = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    if (!name || !email || !password || !password_confirmation) {
        return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const existingUser = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const insertResult = await queryAsync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        const userId = insertResult.insertId;

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        await queryAsync('INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, verificationToken, expiresAt]);

        const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
        await sendEmail(email, 'Account Verification', `<p>Please verify your account by clicking the following link:</p><a href="${verificationLink}">${verificationLink}</a>`);

        const accessToken = generateToken({ id: userId, name, email }, process.env.JWT_SECRET, '30d');
        const refreshToken = generateToken({ id: userId }, process.env.JWT_REFRESH_SECRET, '30d');

        const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await queryAsync(`
            INSERT INTO active_tokens (user_id, refresh_token, expires_at)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                refresh_token = VALUES(refresh_token),
                expires_at = VALUES(expires_at)
        `, [userId, refreshToken, tokenExpiresAt]);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        });

        await createNotification({ user_id: userId, message: 'Welcome to our platform! Your registration was successful.', type: 'Welcome' });

        res.status(201).json({ message: 'Registration successful! Check your email for a verification link.', accessToken });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password' });
    }

    try {
        const results = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateToken(user, process.env.JWT_SECRET, '30d');
        const refreshToken = generateToken(user, process.env.JWT_REFRESH_SECRET, '30d');

        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
        await queryAsync(`
            INSERT INTO active_tokens (user_id, refresh_token, expires_at)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                refresh_token = VALUES(refresh_token),
                expires_at = VALUES(expires_at)
        `, [user.id, refreshToken, expiresAt]);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: '/',
        });

        res.status(200).json({ message: 'Login successful!', accessToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Logout user
const logout = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { path: '/' });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Please provide your email' });
    }

    try {
        const results = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

        const user = results[0];
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await queryAsync(
            `
            INSERT INTO password_resets (user_id, reset_token, expires_at)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
                reset_token = VALUES(reset_token),
                expires_at = VALUES(expires_at)
            `,
            [user.id, resetToken, expiresAt]
        );

        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Password Reset Request', `<p>You requested a password reset. Please use the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`);

        res.status(200).json({ message: 'A password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Error with forgot password:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token, newPassword, passwordConfirmation } = req.body;

    if (!token || !newPassword || !passwordConfirmation) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    if (newPassword !== passwordConfirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const results = await queryAsync('SELECT * FROM password_resets WHERE reset_token = ?', [token]);
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const resetRequest = results[0];
        if (new Date() > resetRequest.expires_at) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await queryAsync('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, resetRequest.user_id]);

        await queryAsync('DELETE FROM password_resets WHERE reset_token = ?', [token]);

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Verify account
const verifyAccount = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
    }

    try {
        const results = await queryAsync('SELECT * FROM verification_tokens WHERE token = ?', [token]);
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const verificationData = results[0];
        if (new Date() > verificationData.expires_at) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        await queryAsync('UPDATE users SET is_verified = 1 WHERE id = ?', [verificationData.user_id]);
        await queryAsync('DELETE FROM verification_tokens WHERE token = ?', [token]);

        res.status(200).json({ message: 'Account verified successfully' });
    } catch (error) {
        console.error('Error verifying account:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Request new verification token
const requestVerificationToken = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const results = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];
        if (user.is_verified) {
            return res.status(400).json({ error: 'Account is already verified' });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await queryAsync('INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, verificationToken, expiresAt]);

        const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
        await sendEmail(email, 'Account Verification', `<p>Please verify your account by clicking the following link:</p><a href="${verificationLink}">${verificationLink}</a>`);

        res.status(200).json({ message: 'A new verification link has been sent to your email.' });
    } catch (error) {
        console.error('Error requesting verification token:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyAccount,
    requestVerificationToken
};
