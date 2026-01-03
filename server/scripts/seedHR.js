const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('../src/config/mongo.config');
const Employee = require('../src/models/Employee');
const User = require('../src/models/User');
const { generatePassword, generateLoginId, hashPassword } = require('../src/services/auth.service');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedHR = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if HR user already exists
    const existingHR = await User.findOne({ role: 'HR' });
    if (existingHR) {
      console.log('HR user already exists!');
      console.log('Login ID:', existingHR.loginId);
      process.exit(0);
    }

    // HR user data - you can modify these values
    const hrData = {
      companyName: process.env.HR_COMPANY_NAME || 'Your Company',
      employeeCode: process.env.HR_EMPLOYEE_CODE || 'HR001',
      firstName: process.env.HR_FIRST_NAME || 'Admin',
      lastName: process.env.HR_LAST_NAME || 'User',
      email: process.env.HR_EMAIL || 'hr@company.com',
      phone: process.env.HR_PHONE || '1234567890'
    };

    console.log('Creating HR user...');
    console.log('HR Data:', hrData);

    // Check if employee with same email or employeeCode already exists
    const existingEmployee = await Employee.findOne({
      $or: [
        { email: hrData.email },
        { employeeCode: hrData.employeeCode }
      ]
    });

    if (existingEmployee) {
      throw new Error('Employee with this email or employee code already exists');
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

    console.log('\n✅ HR user created successfully!');
    console.log('\n=== HR User Credentials ===');
    console.log('Login ID:', loginId);
    console.log('Temporary Password:', temporaryPassword);
    console.log('\n⚠️  IMPORTANT: Save these credentials securely!');
    console.log('The HR user should change the password after first login.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating HR user:', error.message);
    process.exit(1);
  }
};

// Run the seed script
seedHR();

