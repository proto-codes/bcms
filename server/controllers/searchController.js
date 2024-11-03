const db = require('../config/db');

// Helper function to fetch users based on search query
const fetchUsersByQuery = (query) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, name, email
      FROM users
      WHERE name LIKE ? OR email LIKE ?
    `;
    const formattedQuery = `%${query}%`; // Use wildcards for partial matches
    db.query(sql, [formattedQuery, formattedQuery], (error, results) => {
      if (error) {
        return reject(error); // Handle query errors
      }
      resolve(results); // Resolve with fetched results
    });
  });
};

// Controller function to handle search requests
const searchUsers = async (req, res) => {
  const { query } = req.query; // Extract query parameter from the request

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required.' }); // Return error if query is missing
  }

  try {
    const users = await fetchUsersByQuery(query); // Fetch users based on the query
    res.status(200).json(users); // Return the fetched users
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error.' }); // Return error message for server issues
  }
};

module.exports = {
  searchUsers,
};
