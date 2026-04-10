const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/verify', authController.verifyToken);
router.post('/logout', authController.logout);

router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);

router.post('/register/student', authController.registerStudent);
router.post('/register/admin', authController.registerAdmin);
router.post('/register/staff', authController.registerStaff);

router.post('/login/student', authController.loginStudent);
router.post('/login/admin', authController.loginAdmin);
router.post('/login/staff', authController.loginStaff);

module.exports = router;
