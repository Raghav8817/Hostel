const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { verifyStaff } = require('../middleware/auth');

// All staff routes are protected
router.get('/staff/profile', verifyStaff, staffController.getStaffProfile);
router.get('/staff/complaints', verifyStaff, staffController.getComplaints);
router.put('/staff/complaints/:id', verifyStaff, staffController.updateComplaintStatus);

module.exports = router;
