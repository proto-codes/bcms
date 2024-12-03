require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL connection pool setup
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 50,
    queueLimit: 0,
});

// Function to test database connection (optional for monitoring)
async function testConnection() {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('Database connection test successful:', rows);
    } catch (err) {
        console.error('Database connection test failed:', err.message);
    }
}

// Test connection on app startup
testConnection();

// Helper function to query the database using the connection pool
const queryAsync = async (query, params) => {
    try {
        const [results] = await pool.query(query, params);
        return results;
    } catch (err) {
        throw err;
    }
};

module.exports = { queryAsync, pool };