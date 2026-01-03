const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendance.controller');
const { authenticate, authorizeHR } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticate);

// Employee routes - check in/out and view own attendance
router.post('/check-in', attendanceController.checkIn);
router.post('/check-out', attendanceController.checkOut);
router.get('/today', attendanceController.getTodayAttendance);
router.get('/my-attendance', attendanceController.getMyAttendance);

// HR only routes - view all employees attendance
router.get('/all', authorizeHR, attendanceController.getAllEmployeesAttendance);

module.exports = router;

