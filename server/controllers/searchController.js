const { queryAsync } = require('../config/db');

const fetchUsersByQuery = async (query) => {
  const sql = `
    SELECT id, name, email
    FROM users
    WHERE name LIKE ? OR email LIKE ?
  `;
  const formattedQuery = `%${query}%`;
  return await queryAsync(sql, [formattedQuery, formattedQuery]);
};

const searchUsers = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: 'Query parameter is required.' });

  try {
    const users = await fetchUsersByQuery(query);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = { searchUsers };
