const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Routes and Middleware
const apiRoutes = require('./routes/api');
const publicRoutes = require('./routes/public');
const authenticateToken = require('./middleware/auth');

// Initialize Express app and server
const app = express();
const server = http.createServer(app);

// Initialize WebSocket
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    }
});

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

// Apply rate limiter to public routes to prevent abuse
app.use('/public', publicRoutes);

// Protected Routes - require authentication
app.use('/api', authenticateToken, apiRoutes);

// WebSocket connection setup
io.on('connection', (socket) => {
    console.log("New client connected");

    // Handle custom events
    socket.on('customEvent', (data) => {
        console.log("Received data:", data);

        // Example of emitting an event to all connected clients
        io.emit('broadcastEvent', { message: 'Update from server', data });
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log("Client disconnected");
    });
});

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
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = io;
