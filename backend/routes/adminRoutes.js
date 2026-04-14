const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/admin-profile', verifyAdmin, adminController.getProfile);
router.get('/api/get-profile-pic', verifyAdmin, adminController.getProfilePic);
router.post('/api/upload-profile-pic', verifyAdmin, adminController.uploadProfilePic);

router.get('/admin/students', verifyAdmin, adminController.getAllStudents);
router.put('/admin/students/status', verifyAdmin, adminController.updateStudentStatus);
router.put('/admin/assign-room', verifyAdmin, adminController.assignRoom);
router.delete('/admin/students/:username', verifyAdmin, adminController.deleteStudent);

router.get('/admin/dashboard-stats', verifyAdmin, adminController.getDashboardStats);

router.get('/admin/complaints', verifyAdmin, adminController.getAllComplaints);
router.put('/admin/complaints/:id', verifyAdmin, adminController.updateComplaintStatus);
router.delete('/admin/complaints/:id', verifyAdmin, adminController.deleteComplaint);
router.get('/admin/food-reviews', verifyAdmin, adminController.getFoodReviews);

router.get('/admin/rooms-advanced', verifyAdmin, adminController.getRoomsAdvanced);
router.get('/admin/room-requests', verifyAdmin, adminController.getRoomRequests);
router.post('/admin/approve-room', verifyAdmin, adminController.approveRoomRequest);
router.post('/admin/reject-room', verifyAdmin, adminController.rejectRoomRequest);
router.get('/admin/staff', verifyAdmin, adminController.getAllStaff);
router.delete('/admin/staff/:username', verifyAdmin, adminController.deleteStaff);

module.exports = router;
