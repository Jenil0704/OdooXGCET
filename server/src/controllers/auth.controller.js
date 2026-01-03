const authService = require('../services/auth.service.js');

// Register new employee (HR only)
const registerEmployee = async (req, res) => {
  try {
    const {
      companyName,
      employeeCode,
      firstName,
      lastName,
      email,
      phone,
      status
    } = req.body;

    // Validate required fields
    if (!companyName || !employeeCode || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const employeeData = {
      companyName,
      employeeCode,
      firstName,
      lastName,
      email,
      phone,
      status: status || 'ACTIVE'
    };

    const result = await authService.registerEmployee(employeeData);

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: {
        employee: {
          _id: result.employee._id,
          employeeCode: result.employee.employeeCode,
          firstName: result.employee.firstName,
          lastName: result.employee.lastName,
          email: result.employee.email,
          phone: result.employee.phone,
          companyName: result.employee.companyName,
          status: result.employee.status
        },
        credentials: {
          loginId: result.loginId,
          temporaryPassword: result.temporaryPassword
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to register employee',
      error: error.message
    });
  }
};

// Employee login/signin
const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login ID and password are required'
      });
    }

    const result = await authService.login(loginId, password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed',
      error: error.message
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    const result = await authService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        isFirstLogin: result.isFirstLogin
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password',
      error: error.message
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await authService.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          loginId: user.loginId,
          role: user.role,
          isFirstLogin: user.isFirstLogin,
          isActive: user.isActive,
          employee: {
            _id: user.employeeId._id,
            employeeCode: user.employeeId.employeeCode,
            firstName: user.employeeId.firstName,
            lastName: user.employeeId.lastName,
            email: user.employeeId.email,
            phone: user.employeeId.phone,
            companyName: user.employeeId.companyName,
            status: user.employeeId.status
          }
        }
      }
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message || 'User not found',
      error: error.message
    });
  }
};

// Register HR user (for initial setup)
const registerHR = async (req, res) => {
  try {
    const {
      companyName,
      employeeCode,
      firstName,
      lastName,
      email,
      phone
    } = req.body;

    // Validate required fields
    if (!companyName || !employeeCode || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    const hrData = {
      companyName,
      employeeCode,
      firstName,
      lastName,
      email,
      phone
    };

    const result = await authService.registerHR(hrData);

    res.status(201).json({
      success: true,
      message: 'HR user registered successfully',
      data: {
        employee: {
          _id: result.employee._id,
          employeeCode: result.employee.employeeCode,
          firstName: result.employee.firstName,
          lastName: result.employee.lastName,
          email: result.employee.email,
          phone: result.employee.phone,
          companyName: result.employee.companyName,
          status: result.employee.status
        },
        credentials: {
          loginId: result.loginId,
          temporaryPassword: result.temporaryPassword
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to register HR user',
      error: error.message
    });
  }
};

module.exports = {
  registerEmployee,
  registerHR,
  login,
  changePassword,
  getCurrentUser
};

