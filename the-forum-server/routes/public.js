// All public routes
const express = require('express');

const { 
  register, 
  login,
  forgotPassword,
  resetPassword,
  verifyAccount
} = require('../controllers/authController');

const router = express.Router();

// Authentication routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-account', verifyAccount);

module.exports = router;
