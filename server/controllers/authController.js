const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Helper function for Promisified MySQL query
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

// Function to check password strength
const checkPasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character and be at least 8 characters long';
    }
    return null; // No issues found, password is strong enough
};

const register = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    // Validation checks
    if (!name || !email || !password || !password_confirmation) {
        return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (password !== password_confirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    const passwordStrengthError = checkPasswordStrength(password);
    if (passwordStrengthError) {
        return res.status(400).json({ error: passwordStrengthError });
    }

    try {
        // Check if email already exists
        const existingUser = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash password and insert user
        const hashedPassword = await bcrypt.hash(password, 12);
        const insertResult = await queryAsync('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        const userId = insertResult.insertId;

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // Token valid for 24 hours
        await queryAsync('INSERT INTO verification_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, verificationToken, expiresAt]);

        // Email verification link to user
        const verificationLink = `${process.env.FRONTEND_URL}/verify-account?token=${verificationToken}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Verification',
            html: `<p>Please verify your account by clicking the following link:</p><a href="${verificationLink}">${verificationLink}</a>`
        });

        // Generate JWT token
        const token = jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const tokenExpiresAt = new Date(Date.now() + 3600000); // Token expiration in 1 hour

        // Store JWT token in the active_tokens table
        await queryAsync('INSERT INTO active_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, token, tokenExpiresAt]);

        res.status(201).json({
            message: 'Registration successful! Check your email for a verification link.', token });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expiresAt = new Date(Date.now() + 3600000);
        await queryAsync('INSERT INTO active_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [user.id, token, expiresAt]);

        res.status(201).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const logout = (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];

    db.query('DELETE FROM active_tokens WHERE token = ?', [token], (err) => {
        if (err) return res.status(500).send('Server error');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Please provide your email' });
    }

    try {
        // Check if the email exists
        const results = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(404).json({ error: 'No user found with this email' });
        }

        const user = results[0];
        
        // Generate a unique reset token and set expiration
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // Token valid for 1 hour

        // Store the reset token and expiration in the database
        await queryAsync('INSERT INTO password_resets (user_id, reset_token, expires_at) VALUES (?, ?, ?)', [user.id, resetToken, expiresAt]);

        // Set up nodemailer for sending the reset email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS  // Your email password
            }
        });

        // Send email with reset link
        const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please use the following link to reset your password: ${resetUrl}`,
            html: `<p>You requested a password reset. Please use the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        });

        res.status(200).json({ message: 'A password reset link has been sent to your email.' });
    } catch (error) {
        console.error('Error with forgot password:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    const { token, newPassword, passwordConfirmation } = req.body;

    // Check if all fields are provided
    if (!token || !newPassword || !passwordConfirmation) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // Check if passwords match
    if (newPassword !== passwordConfirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    // Check password strength
    const passwordStrengthError = checkPasswordStrength(newPassword);
    if (passwordStrengthError) {
        return res.status(400).json({ error: passwordStrengthError });
    }

    try {
        // Find the reset request in the database
        const results = await queryAsync('SELECT * FROM password_resets WHERE reset_token = ?', [token]);
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const resetRequest = results[0];

        // Check if the token has expired
        if (new Date() > resetRequest.expires_at) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        // Hash the new password and update it in the users table
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await queryAsync('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, resetRequest.user_id]);

        // Remove the used token
        await queryAsync('DELETE FROM password_resets WHERE reset_token = ?', [token]);

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const verifyAccount = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Verification token is required' });
    }

    try {
        // Look up the token in the database
        const results = await queryAsync('SELECT * FROM verification_tokens WHERE token = ?', [token]);
        if (results.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const verification = results[0];

        // Check if the token has expired
        if (new Date() > verification.expires_at) {
            return res.status(400).json({ error: 'Token has expired' });
        }

        // Mark the user as confirmed in the database
        await queryAsync('UPDATE users SET confirmed = 1 WHERE id = ?', [verification.user_id]);

        // Delete the token after successful confirmation
        await queryAsync('DELETE FROM verification_tokens WHERE token = ?', [token]);

        res.status(200).json({ message: 'Account confirmed successfully!' });
    } catch (error) {
        console.error('Error during account verification:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { register, login, logout, forgotPassword, resetPassword, verifyAccount };
