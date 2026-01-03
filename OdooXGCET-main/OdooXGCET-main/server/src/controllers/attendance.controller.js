const attendanceService = require('../services/attendance.service');

// Check in
const checkIn = async (req, res) => {
  try {
    const userId = req.userId;
    const employeeId = req.user.employeeId._id;

    const result = await attendanceService.checkIn(userId, employeeId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to check in',
      error: error.message
    });
  }
};

// Check out
const checkOut = async (req, res) => {
  try {
    const userId = req.userId;
    const employeeId = req.user.employeeId._id;

    const result = await attendanceService.checkOut(userId, employeeId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.attendance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to check out',
      error: error.message
    });
  }
};

// Get today's attendance status
const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.userId;
    const employeeId = req.user.employeeId._id;

    const attendance = await attendanceService.getTodayAttendance(userId, employeeId);

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get today\'s attendance',
      error: error.message
    });
  }
};

// Get employee's own attendance records
const getMyAttendance = async (req, res) => {
  try {
    const userId = req.userId;
    const employeeId = req.user.employeeId._id;
    const { startDate, endDate } = req.query;

    const attendanceRecords = await attendanceService.getEmployeeAttendance(
      employeeId,
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: {
        attendance: attendanceRecords,
        count: attendanceRecords.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get attendance records',
      error: error.message
    });
  }
};

// Get all employees attendance (HR only)
const getAllEmployeesAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const attendanceData = await attendanceService.getAllEmployeesAttendance(
      startDate,
      endDate
    );

    res.status(200).json({
      success: true,
      data: {
        attendance: attendanceData,
        count: attendanceData.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get all employees attendance',
      error: error.message
    });
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getMyAttendance,
  getAllEmployeesAttendance
};

