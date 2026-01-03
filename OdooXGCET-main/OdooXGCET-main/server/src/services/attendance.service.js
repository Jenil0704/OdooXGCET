const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const User = require('../models/User');

// Helper function to get start and end of day
const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Check in
const checkIn = async (userId, employeeId) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);

    // Check if already checked in today
    const existingAttendance = await Attendance.findOne({
      employeeId: employeeId,
      date: {
        $gte: today,
        $lte: getEndOfDay(now)
      }
    });

    if (existingAttendance && existingAttendance.checkIn) {
      throw new Error('You have already checked in today');
    }

    // Create or update attendance record
    let attendance;
    if (existingAttendance) {
      attendance = existingAttendance;
      attendance.checkIn = now;
      attendance.status = 'PRESENT';
    } else {
      attendance = new Attendance({
        employeeId: employeeId,
        userId: userId,
        date: today,
        checkIn: now,
        status: 'PRESENT'
      });
    }

    attendance.updatedAt = now;
    await attendance.save();

    return {
      attendance: {
        _id: attendance._id,
        employeeId: attendance.employeeId,
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
        workHours: attendance.workHours
      },
      message: 'Checked in successfully'
    };
  } catch (error) {
    throw error;
  }
};

// Check out
const checkOut = async (userId, employeeId) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);

    // Find today's attendance record
    const attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: {
        $gte: today,
        $lte: getEndOfDay(now)
      }
    });

    if (!attendance) {
      throw new Error('No check-in record found for today. Please check in first.');
    }

    if (!attendance.checkIn) {
      throw new Error('You have not checked in today');
    }

    if (attendance.checkOut) {
      throw new Error('You have already checked out today');
    }

    // Calculate work hours
    const checkInTime = new Date(attendance.checkIn);
    const checkOutTime = now;
    const workHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert to hours

    attendance.checkOut = checkOutTime;
    attendance.workHours = parseFloat(workHours.toFixed(2));
    attendance.status = workHours >= 4 ? 'PRESENT' : 'PARTIAL';
    attendance.updatedAt = now;

    await attendance.save();

    return {
      attendance: {
        _id: attendance._id,
        employeeId: attendance.employeeId,
        date: attendance.date,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        status: attendance.status,
        workHours: attendance.workHours
      },
      message: 'Checked out successfully'
    };
  } catch (error) {
    throw error;
  }
};

// Get today's attendance status
const getTodayAttendance = async (userId, employeeId) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);

    const attendance = await Attendance.findOne({
      employeeId: employeeId,
      date: {
        $gte: today,
        $lte: getEndOfDay(now)
      }
    }).populate('employeeId', 'firstName lastName employeeCode');

    if (!attendance) {
      return {
        isCheckedIn: false,
        isCheckedOut: false,
        checkIn: null,
        checkOut: null,
        workHours: 0,
        status: null
      };
    }

    return {
      isCheckedIn: !!attendance.checkIn,
      isCheckedOut: !!attendance.checkOut,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      workHours: attendance.workHours,
      status: attendance.status,
      attendanceId: attendance._id
    };
  } catch (error) {
    throw error;
  }
};

// Get attendance records for an employee
const getEmployeeAttendance = async (employeeId, startDate, endDate) => {
  try {
    const query = { employeeId: employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: getStartOfDay(new Date(startDate)),
        $lte: getEndOfDay(new Date(endDate))
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeCode email')
      .sort({ date: -1 })
      .limit(100); // Limit to last 100 records

    return attendanceRecords.map(record => ({
      _id: record._id,
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      workHours: record.workHours,
      status: record.status,
      notes: record.notes
    }));
  } catch (error) {
    throw error;
  }
};

// Get all employees attendance (for admin)
const getAllEmployeesAttendance = async (startDate, endDate) => {
  try {
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: getStartOfDay(new Date(startDate)),
        $lte: getEndOfDay(new Date(endDate))
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('employeeId', 'firstName lastName employeeCode email companyName')
      .populate('userId', 'loginId role')
      .sort({ date: -1, employeeId: 1 })
      .limit(500); // Limit to last 500 records

    // Group by employee
    const groupedByEmployee = {};
    attendanceRecords.forEach(record => {
      const empId = record.employeeId._id.toString();
      if (!groupedByEmployee[empId]) {
        groupedByEmployee[empId] = {
          employee: {
            _id: record.employeeId._id,
            firstName: record.employeeId.firstName,
            lastName: record.employeeId.lastName,
            employeeCode: record.employeeId.employeeCode,
            email: record.employeeId.email,
            companyName: record.employeeId.companyName
          },
          records: []
        };
      }
      groupedByEmployee[empId].records.push({
        _id: record._id,
        date: record.date,
        checkIn: record.checkIn,
        checkOut: record.checkOut,
        workHours: record.workHours,
        status: record.status,
        notes: record.notes
      });
    });

    return Object.values(groupedByEmployee);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  checkIn,
  checkOut,
  getTodayAttendance,
  getEmployeeAttendance,
  getAllEmployeesAttendance
};

