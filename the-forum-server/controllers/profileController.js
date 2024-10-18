const db = require('../config/db'); // Your database connection setup

// Helper function to query the database
const queryAsync = (query, params) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Fetch user profile
const getProfile = async (req, res) => {
  const userId = req.user.id; // Assuming you have user info in req.user from middleware

  try {
    const user = await queryAsync('SELECT * FROM users WHERE id = ?', [userId]);
    const profile = await queryAsync('SELECT * FROM profile WHERE user_id = ?', [userId]);

    if (!user.length || !profile.length) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = {
      name: user[0].name,
      email: user[0].email,
      bio: profile[0].bio,
      avatar: profile[0].profile_pics,
      address: profile[0].address,
      phone: profile[0].phone_number,
      dob: profile[0].birthday,
    };

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  const userId = req.user.id; // Assuming you have user info in req.user from middleware
  const { name, email, bio, address, phone, dob } = req.body;

  try {
    // Handle file upload
    let profilePics;
    if (req.file) {
      profilePics = req.file.path; // Use the uploaded file path
    }

    // Update user and profile data
    await queryAsync('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    await queryAsync(
      'UPDATE profile SET bio = ?, profile_pics = ?, address = ?, phone_number = ?, birthday = ? WHERE user_id = ?',
      [bio, profilePics || null, address, phone, dob, userId]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
