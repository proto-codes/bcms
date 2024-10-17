const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Helper function for Promisified MySQL query
const queryAsync = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

const register = async (req, res) => {
    const { name, email, password, password_confirmation } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !password_confirmation) {
        return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    // Check if passwords match
    if (password !== password_confirmation) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

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

    // Check password strength
    const passwordStrengthError = checkPasswordStrength(password);
    if (passwordStrengthError) {
        return res.status(400).json({ error: passwordStrengthError });
    }

    try {
        // Check if the email already exists
        const existingUser = await queryAsync('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insert the new user and retrieve the inserted user's ID
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const insertResult = await queryAsync(query, [name, email, hashedPassword]);

        // Get the inserted user ID from the result
        const userId = insertResult.insertId;

        // Generate the JWT token
        const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in the active_tokens table
        const expiresAt = new Date(Date.now() + 3600000);
        await queryAsync('INSERT INTO active_tokens (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, token, expiresAt]);

        // Respond with the token to automatically log in the user
        res.status(201).json({ message: 'User registered successfully', token });
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

        res.json({ token });
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

module.exports = { register, login, logout };
