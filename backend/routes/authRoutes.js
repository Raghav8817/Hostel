const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Inject parameterized role targets into the endpoints!
router.post('/register/:role', authController.register);
router.post('/login/:role', authController.login);

// Global state verification tokens (parses role dynamically internally, no URL params needed)
router.post('/verify-token', authController.verifyToken);
router.post('/logout', authController.logout);

module.exports = router;
