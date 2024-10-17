const db = require('../config/db'); // Your database connection setup

// Fetch user profile
const getProfile = async (req, res) => {
  const userId = req.user.id; // Assuming you have user info in req.user from middleware

  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const [profile] = await db.query('SELECT * FROM profile WHERE user_id = ?', [userId]);

    if (!user || !profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = {
      name: user.name,
      email: user.email,
      bio: profile.bio,
      avatar: profile.profile_pics,
      address: profile.address,
      phone: profile.phone_number,
      dob: profile.birthday,
    };

    res.json(userData);
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
    await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, userId]);
    await db.query(
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
