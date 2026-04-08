const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/user-data', studentController.getUserData);
router.put('/edit', studentController.editProfile);
router.get('/notifications', studentController.getNotifications);
router.put('/notifications/read/:id', studentController.markNotificationRead);
router.delete('/notifications/clear', studentController.clearNotifications);
router.get('/complaints', studentController.getComplaints);
router.post('/complaints', studentController.postComplaint);
router.get('/leave', studentController.getLeaveHistory);
router.post('/leave', studentController.applyLeave);
router.post('/food-review', studentController.submitFoodReview);

module.exports = router;
