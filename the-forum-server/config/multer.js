const multer = require('multer');

// Configure storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

module.exports = upload;
