const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const apiRoutes = require('./routes/api');
const publicRoutes = require('./routes/public');
const authenticateToken = require('./middleware/auth');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

// Public Routes - accessible without authentication
app.use('/public', publicRoutes);

// Protected Routes - require authentication
app.use('/api', authenticateToken, apiRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
