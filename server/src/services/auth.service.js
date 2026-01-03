const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const User = require('../models/User');

// Generate a random password
const generatePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Generate login ID based on employee details
const generateLoginId = (firstName, lastName, employeeCode) => {
  const firstInitial = firstName.charAt(0).toUpperCase();
  const lastInitial = lastName.charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}${employeeCode}`.toUpperCase();
};

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register new employee (HR only)
const registerEmployee = async (employeeData) => {
  try {
    // Check if employee with same email or employeeCode already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: employeeData.email },
        { employeeCode: employeeData.employeeCode }
      ]
    });

    if (existingEmployee) {
      throw new Error('Employee with this email or employee code already exists');
    }

    // Create employee
    const employee = new Employee(employeeData);
    await employee.save();

    // Generate login ID and password
    let loginId = generateLoginId(
      employee.firstName,
      employee.lastName,
      employee.employeeCode
    );

    // Check if loginId already exists (unlikely but possible)
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      // If loginId exists, append a number
      let counter = 1;
      let newLoginId = `${loginId}${counter}`;
      while (await User.findOne({ loginId: newLoginId })) {
        counter++;
        newLoginId = `${loginId}${counter}`;
      }
      loginId = newLoginId;
    }

    const temporaryPassword = generatePassword();
    const passwordHash = await hashPassword(temporaryPassword);

    // Create user account
    const user = new User({
      employeeId: employee._id,
      loginId: loginId,
      passwordHash: passwordHash,
      role: 'EMPLOYEE',
      isFirstLogin: true,
      isActive: true
    });

    await user.save();

    return {
      employee,
      loginId,
      temporaryPassword, // Return plain password only once for HR to share with employee
      user: {
        _id: user._id,
        loginId: user.loginId,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

// Employee login/signin
const login = async (loginId, password) => {
  try {
    // Find user by loginId
    const user = await User.findOne({ loginId }).populate('employeeId');

    if (!user) {
      throw new Error('Invalid login credentials');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive. Please contact HR.');
    }

    // Check if employee is active
    if (user.employeeId.status !== 'ACTIVE') {
      throw new Error('Employee account is inactive. Please contact HR.');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid login credentials');
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data without password
    const userData = {
      _id: user._id,
      loginId: user.loginId,
      role: user.role,
      isFirstLogin: user.isFirstLogin,
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
    };

    return {
      token,
      user: userData
    };
  } catch (error) {
    throw error;
  }
};

// Change password
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password (minimum 8 characters)
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    user.passwordHash = newPasswordHash;
    user.isFirstLogin = false;
    user.updatedAt = new Date();
    await user.save();

    return {
      message: 'Password changed successfully',
      isFirstLogin: user.isFirstLogin
    };
  } catch (error) {
    throw error;
  }
};

// Get current user profile
const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId)
      .populate('employeeId')
      .select('-passwordHash');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw error;
  }
};

// Register HR user (for initial setup)
const registerHR = async (hrData) => {
  try {
    // Check if employee with same email or employeeCode already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: hrData.email },
        { employeeCode: hrData.employeeCode }
      ]
    });

    if (existingEmployee) {
      throw new Error('HR user with this email or employee code already exists');
    }

    // Check if HR user already exists
    const existingHR = await User.findOne({ role: 'HR' });
    if (existingHR && !process.env.ALLOW_MULTIPLE_HR) {
      throw new Error('HR user already exists. Use seed script or set ALLOW_MULTIPLE_HR=true to create more.');
    }

    // Create employee record for HR
    const employee = new Employee({
      companyName: hrData.companyName,
      employeeCode: hrData.employeeCode,
      firstName: hrData.firstName,
      lastName: hrData.lastName,
      email: hrData.email,
      phone: hrData.phone,
      status: 'ACTIVE'
    });
    await employee.save();

    // Generate login ID and password
    let loginId = generateLoginId(
      employee.firstName,
      employee.lastName,
      employee.employeeCode
    );

    // Check if loginId already exists
    const existingUser = await User.findOne({ loginId });
    if (existingUser) {
      let counter = 1;
      let newLoginId = `${loginId}${counter}`;
      while (await User.findOne({ loginId: newLoginId })) {
        counter++;
        newLoginId = `${loginId}${counter}`;
      }
      loginId = newLoginId;
    }

    const temporaryPassword = generatePassword();
    const passwordHash = await hashPassword(temporaryPassword);

    // Create HR user account
    const user = new User({
      employeeId: employee._id,
      loginId: loginId,
      passwordHash: passwordHash,
      role: 'HR',
      isFirstLogin: true,
      isActive: true
    });

    await user.save();

    return {
      employee,
      loginId,
      temporaryPassword, // Return plain password only once
      user: {
        _id: user._id,
        loginId: user.loginId,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerEmployee,
  registerHR,
  login,
  changePassword,
  getCurrentUser,
  generatePassword,
  generateLoginId,
  hashPassword,
  comparePassword,
  generateToken
};

