const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/user', authenticateToken, getUserDetails);

module.exports = router;
