const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Routes and Middleware
const apiRoutes = require('./routes/api');
const publicRoutes = require('./routes/public');
const authenticateToken = require('./middleware/auth');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Increase JSON payload size limit
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet({
    contentSecurityPolicy: process.env.NODE_ENV === 'production', // Enable CSP only in production
}));

// Public routes
app.use('/public', publicRoutes);

// Protected Routes - require authentication
app.use('/api', authenticateToken, apiRoutes);

// Global 404 error handling
app.use((req, res) => {
    res.status(404).json({ error: "Resource not found" });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
