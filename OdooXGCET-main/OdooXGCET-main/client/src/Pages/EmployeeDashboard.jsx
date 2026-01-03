import React, { useState, useEffect } from 'react';
import { User, LogOut, Camera, Clock, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/auth';
import attendanceApi from '../api/attendance';
import EmployeeCard from '../Components/EmployeeCard';

// ==================== PROFILE PAGE COMPONENT ====================
const ProfilePage = ({ currentUser, onUpdateProfile, onAvatarUpload }) => {
  const [activeTab, setActiveTab] = useState('private-info');
  const [formData, setFormData] = useState({
    name: currentUser.name,
    jobPosition: currentUser.role,
    email: currentUser.email || '',
    mobile: currentUser.mobile || '',
    company: currentUser.company || '',
    department: currentUser.department || '',
    manager: currentUser.manager || '',
    location: currentUser.location || '',
    dob: currentUser.dob || '',
    address: currentUser.address || '',
    nationality: currentUser.nationality || '',
    personalEmail: currentUser.personalEmail || '',
    gender: currentUser.gender || '',
    maritalStatus: currentUser.maritalStatus || '',
    joiningDate: currentUser.joiningDate || '',
    accountNumber: currentUser.accountNumber || '',
    bankName: currentUser.bankName || '',
    ifscCode: currentUser.ifscCode || '',
    panNo: currentUser.panNo || '',
    uanNo: currentUser.uanNo || '',
    empCode: currentUser.empCode || ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-750 p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">My Profile</h2>
        </div>

        {/* Profile Section */}
        <div className="p-6 flex items-start space-x-8 border-b border-gray-700">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {currentUser.avatar ? (
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-gray-500" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarUpload}
                className="hidden"
              />
              <Camera className="w-4 h-4 text-white" />
            </label>
            <p className="text-center mt-2 text-green-400 text-sm">Ornate Opossum</p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="text-gray-400 text-sm">My Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Job Position</label>
              <input
                type="text"
                value={formData.jobPosition}
                onChange={(e) => handleInputChange('jobPosition', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Manager</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Mobile</label>
              <input
                type="text"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-transparent border-b border-gray-600 py-1 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-6 py-3 font-medium ${activeTab === 'resume' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Resume
          </button>
          <button
            onClick={() => setActiveTab('private-info')}
            className={`px-6 py-3 font-medium ${activeTab === 'private-info' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Private Info
          </button>
          <button
            onClick={() => setActiveTab('salary-info')}
            className={`px-6 py-3 font-medium ${activeTab === 'salary-info' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Salary Info
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 font-medium ${activeTab === 'security' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'resume' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Upload your resume (PDF, DOC, DOCX)</p>
                <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                  Choose File
                </button>
              </div>
            </div>
          )}

          {activeTab === 'private-info' && (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Residing Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Personal Email</label>
                <input
                  type="email"
                  value={formData.personalEmail}
                  onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Gender</label>
                <input
                  type="text"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Marital Status</label>
                <input
                  type="text"
                  value={formData.maritalStatus}
                  onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Date of Joining</label>
                <input
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'salary-info' && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Salary Info</h3>
                
                {/* Wage Information */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Month Wage</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xl font-semibold">₹50,000</span>
                      <span className="text-gray-400">/ Month</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">No of working days in a week</label>
                    <div className="text-white text-xl font-semibold">5</div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Yearly wage</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xl font-semibold">₹6,00,000</span>
                      <span className="text-gray-400">/hrs</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-400 text-sm">Break Time</label>
                    <div className="text-white text-xl font-semibold">1 hour</div>
                  </div>
                </div>

                {/* Salary Components */}
                <div className="border-t border-gray-700 pt-6 mb-6">
                  <h4 className="text-md font-semibold mb-4">Salary Components</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Basic Salary</p>
                        <p className="text-gray-500 text-xs">Define Basic Salary from company CRSS computed it based on monthly Wages</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹25,000.00</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">50.00 %</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">House Rent Allowance</p>
                        <p className="text-gray-500 text-xs">HRA provided to employees 50% of the basic salary</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹12,500.00</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">25.00 %</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Standard Allowance</p>
                        <p className="text-gray-500 text-xs">A standard allowance is a predetermined, fixed amount provided to employees as part of their salary</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹4,167.00</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">16.67 %</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Performance Bonus</p>
                        <p className="text-gray-500 text-xs">Bonus awarded for payroll. The value defined by the company and calculated as a % of the basic salary</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹2,082.50</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">8.33 %</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Leave Travel Allowance</p>
                        <p className="text-gray-500 text-xs">LTA is paid by the company to employees to cover their travel expenses, and calculated as a % of the basic salary</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹2,082.50</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">8.33 %</span></p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-white font-medium">Fixed Allowance</p>
                        <p className="text-gray-500 text-xs">Fixed allowance, portion of wage's is determined after calculating all salary components</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">₹2,918.00</p>
                        <p className="text-gray-400 text-sm">₹/ month <span className="ml-2">11.67 %</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Provident Fund & Tax Deductions */}
                <div className="border-t border-gray-700 pt-6 grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-md font-semibold mb-4">Provident Fund (PF) Contribution</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Employee</span>
                        <span className="text-white">₹3,000.00</span>
                      </div>
                      <p className="text-gray-500 text-xs">PF is calculated based on the basic salary</p>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Employer</span>
                        <span className="text-white">₹3,000.00</span>
                      </div>
                      <p className="text-gray-500 text-xs">PF Employer is calculated based on the basic salary</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold mb-4">Tax Deductions</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Professional Tax</span>
                        <span className="text-white">₹200.00 / month</span>
                      </div>
                      <p className="text-gray-500 text-xs">Professional Tax deducted from the Gross Salary</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Information Box */}
              <div className="mt-8 bg-gray-750 border border-gray-600 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Important</h4>
                <div className="text-gray-300 text-sm space-y-3">
                  <p>The Salary Information tab allows users to define and manage all salary-related details for an employee, including wage type, working schedule, salary components, benefits. Salary components should be calculated automatically based on the defined wage.</p>
                  
                  <div className="mt-4">
                    <p className="font-semibold mb-2">- Wage Type</p>
                    <p className="ml-4">Fixed wage.</p>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold mb-2">- Salary Components</p>
                    <p className="ml-4">Section where users can define salary structure components.</p>
                    <p className="ml-4 mt-2">Each component should include: Basic, House Rent Allowance, Standard Allowance, Performance Bonus, Leave Travel Allowance, Fixed Allowance</p>
                  </div>

                  <p className="mt-4">Computation Type: Fixed Amount or Percentage of Wage</p>

                  <p className="mt-4">Value: Percentage Field (e.g., 50% for Basic, 50% of Basic for HRA ; Standard Allowance 416.7 , Performance Bonus & Leave Travel Allowance 8.333%, Fixed allowance is = wage - total of all the component )</p>

                  <p className="mt-4">Salary component values should auto-update when the wage changes. The total of all components should not exceed the defined wage</p>

                  <div className="mt-4">
                    <p className="font-semibold mb-2">- Automatic Calculation:</p>
                    <p className="ml-4">The system should calculate each component amount based on the employee's defined Wage.</p>
                  </div>

                  <div className="mt-4">
                    <p className="font-semibold mb-2">Example:</p>
                    <p className="ml-4">If Wage = ₹50,000 and Basic = 50% of wage, then Basic = ₹25,000.</p>
                    <p className="ml-4 mt-2">If HRA = 50% of Basic, then HRA = ₹12,500.</p>
                  </div>

                  <p className="mt-4">Each fields for configuration (e.g, PF rate 12%), and Professional Tax 200</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full bg-gray-750 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP COMPONENT ====================
export default function EmployeeDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState('employees');
  
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeesError, setEmployeesError] = useState(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loadingTodayAttendance, setLoadingTodayAttendance] = useState(false);
  const [myAttendanceRecords, setMyAttendanceRecords] = useState([]);
  const [loadingMyAttendance, setLoadingMyAttendance] = useState(false);

  // Fetch employees data
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setEmployeesError(null);
        
        // All authenticated users can view employees list (limited data)
        const response = await authApi.getAllEmployeesView();
        
        // Transform API response to match component structure
        const transformedEmployees = response.data.employees.map((emp) => ({
          id: emp._id,
          _id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          firstName: emp.firstName,
          lastName: emp.lastName,
          employeeCode: emp.employeeCode,
          email: emp.email || undefined, // May not be available in view endpoint
          phone: emp.phone || undefined, // May not be available in view endpoint
          companyName: emp.companyName,
          role: emp.role || 'Employee',
          status: 'checked-out', // Default status, can be updated based on attendance data
          avatar: null,
          employeeStatus: emp.status, // ACTIVE/INACTIVE
          canEdit: user?.role === 'HR', // Only HR can edit
          canViewDetails: user?.role === 'HR' || emp._id === user?.employee?._id, // HR or own profile
        }));

        setEmployees(transformedEmployees);
        
        // Set current user ID if user is logged in
        if (user?.employee?._id) {
          const currentEmp = transformedEmployees.find(
            emp => emp._id === user.employee._id
          );
          if (currentEmp) {
            setCurrentUserId(currentEmp.id);
          }
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployeesError(error.message || 'Failed to fetch employees');
      } finally {
        setLoadingEmployees(false);
      }
    };

    if (currentPage === 'employees' && user) {
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, user]);

  // Fetch today's attendance when attendance page is active or on mount
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (user) {
        try {
          setLoadingTodayAttendance(true);
          const response = await attendanceApi.getTodayAttendance();
          setTodayAttendance(response.data);
          
          // Update employee status based on attendance
          if (currentUserId) {
            setEmployees(prev => prev.map(emp => 
              emp.id === currentUserId 
                ? { ...emp, status: response.data.isCheckedIn && !response.data.isCheckedOut ? 'checked-in' : 'checked-out' }
                : emp
            ));
          }
        } catch (error) {
          console.error('Error fetching today attendance:', error);
        } finally {
          setLoadingTodayAttendance(false);
        }
      }
    };

    fetchTodayAttendance();
  }, [currentPage, user, currentUserId]);

  const currentUser = employees.find(emp => emp.id === currentUserId);

  const handleCheckIn = async () => {
    try {
      setLoadingTodayAttendance(true);
      const response = await attendanceApi.checkIn();
      
      // Update today's attendance state
      setTodayAttendance({
        isCheckedIn: true,
        isCheckedOut: false,
        checkIn: response.data.checkIn,
        status: response.data.status
      });
      
      // Update employee status in the list
      setEmployees(prev => prev.map(emp => 
        emp.id === currentUserId ? { ...emp, status: 'checked-in' } : emp
      ));
      
      // Add to attendance history
      setAttendanceHistory(prev => [...prev, {
        type: 'check-in',
        timestamp: new Date(response.data.checkIn).toLocaleString(),
        date: new Date().toLocaleDateString()
      }]);
      
      alert('Checked in successfully!');
    } catch (error) {
      alert(error.message || 'Failed to check in');
      console.error('Check-in error:', error);
    } finally {
      setLoadingTodayAttendance(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoadingTodayAttendance(true);
      const response = await attendanceApi.checkOut();
      
      // Update today's attendance state
      setTodayAttendance({
        isCheckedIn: true,
        isCheckedOut: true,
        checkIn: response.data.checkIn,
        checkOut: response.data.checkOut,
        workHours: response.data.workHours,
        status: response.data.status
      });
      
      // Update employee status in the list
      setEmployees(prev => prev.map(emp => 
        emp.id === currentUserId ? { ...emp, status: 'checked-out' } : emp
      ));
      
      // Add to attendance history
      setAttendanceHistory(prev => [...prev, {
        type: 'check-out',
        timestamp: new Date(response.data.checkOut).toLocaleString(),
        date: new Date().toLocaleDateString()
      }]);
      
      alert(`Checked out successfully! Work hours: ${response.data.workHours} hrs`);
    } catch (error) {
      alert(error.message || 'Failed to check out');
      console.error('Check-out error:', error);
    } finally {
      setLoadingTodayAttendance(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEmployees(prev => prev.map(emp => 
          emp.id === currentUserId ? { ...emp, avatar: reader.result } : emp
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    if (todayAttendance?.isCheckedIn && !todayAttendance?.isCheckedOut) {
      const confirmLogout = window.confirm('You are currently checked in. Do you want to check out before logging out?');
      if (confirmLogout) {
        await handleCheckOut();
      }
    }
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header - Fixed on all pages */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Company Logo</h1>
            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentPage('employees')}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  currentPage === 'employees' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Employees
              </button>
              <button
                onClick={() => setCurrentPage('attendance')}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  currentPage === 'attendance' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Attendance
              </button>
              <button
                onClick={() => setCurrentPage('time-off')}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  currentPage === 'time-off' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                Time Off
              </button>
            </nav>
          </div>

          {/* Check In/Out + User Profile - Fixed on all pages */}
          <div className="flex items-center space-x-3">
            {/* Check In/Out Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleCheckIn}
                disabled={todayAttendance?.isCheckedIn || loadingTodayAttendance}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  todayAttendance?.isCheckedIn || loadingTodayAttendance
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loadingTodayAttendance ? 'Processing...' : 'Check In'}
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance?.isCheckedIn || todayAttendance?.isCheckedOut || loadingTodayAttendance}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  !todayAttendance?.isCheckedIn || todayAttendance?.isCheckedOut || loadingTodayAttendance
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loadingTodayAttendance ? 'Processing...' : 'Check Out'}
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 hover:bg-gray-700 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden relative">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-gray-400" />
                  )}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-800 ${
                    todayAttendance?.isCheckedIn && !todayAttendance?.isCheckedOut ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                <span className="text-sm">{currentUser?.name}</span>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-10">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
                  >
                    My Profile
                  </button>
                  <label className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4" />
                      <span>Change Avatar</span>
                    </div>
                  </label>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'employees' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">All Employees</h2>
              <p className="text-gray-400 text-sm">
                View all employees and their current status. Your card is highlighted.
              </p>
            </div>

            {/* Loading State */}
            {loadingEmployees && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading employees...</div>
              </div>
            )}

            {/* Error State */}
            {employeesError && !loadingEmployees && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                <p className="text-red-400">Error: {employeesError}</p>
                <button
                  onClick={() => setCurrentPage('employees')}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Employee Cards Grid */}
            {!loadingEmployees && !employeesError && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                  {employees.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">
                      No employees found.
                    </div>
                  ) : (
                    employees.map(employee => (
                      <EmployeeCard
                        key={employee.id}
                        employee={employee}
                        isCurrentUser={employee.id === currentUserId}
                        canViewDetails={employee.canViewDetails}
                        canEdit={employee.canEdit}
                      />
                    ))
                  )}
                </div>

                {/* Employees Count */}
                {employees.length > 0 && (
                  <div className="text-gray-400 text-sm mb-4">
                    Total Employees: {employees.length}
                  </div>
                )}

                {/* Attendance History */}
                {attendanceHistory.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
                    <h3 className="text-xl font-bold mb-4">My Attendance Today</h3>
                    <div className="space-y-3">
                      {attendanceHistory.slice().reverse().map((record, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-750 p-4 rounded">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${record.type === 'check-in' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="font-medium capitalize">{record.type.replace('-', ' ')}</span>
                          </div>
                          <span className="text-gray-400 text-sm">{record.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onAvatarUpload={handleAvatarUpload}
          />
        )}

        {currentPage === 'attendance' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">My Attendance</h2>
              <p className="text-gray-400 text-sm">View your attendance records</p>
            </div>

            {/* Today's Attendance Status */}
            {loadingTodayAttendance && (
              <div className="text-center py-4 text-gray-400 mb-6">Loading today's attendance...</div>
            )}

            {!loadingTodayAttendance && todayAttendance && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-4">Today's Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Check In</p>
                    <p className="text-white font-medium">
                      {todayAttendance.checkIn 
                        ? new Date(todayAttendance.checkIn).toLocaleString()
                        : 'Not checked in'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Check Out</p>
                    <p className="text-white font-medium">
                      {todayAttendance.checkOut 
                        ? new Date(todayAttendance.checkOut).toLocaleString()
                        : 'Not checked out'}
                    </p>
                  </div>
                  {todayAttendance.workHours > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Work Hours</p>
                      <p className="text-white font-medium">{todayAttendance.workHours} hrs</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-sm">Status</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      todayAttendance.status === 'PRESENT' 
                        ? 'bg-green-900/30 text-green-400'
                        : todayAttendance.status === 'PARTIAL'
                        ? 'bg-yellow-900/30 text-yellow-400'
                        : 'bg-gray-900/30 text-gray-400'
                    }`}>
                      {todayAttendance.status || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Load Attendance Records Button */}
            <div className="mb-4">
              <button
                onClick={async () => {
                  try {
                    setLoadingMyAttendance(true);
                    const response = await attendanceApi.getMyAttendance();
                    setMyAttendanceRecords(response.data.attendance || []);
                  } catch (error) {
                    console.error('Error fetching attendance:', error);
                    alert('Failed to fetch attendance records');
                  } finally {
                    setLoadingMyAttendance(false);
                  }
                }}
                disabled={loadingMyAttendance}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-600"
              >
                {loadingMyAttendance ? 'Loading...' : 'Load My Attendance Records'}
              </button>
            </div>

            {/* Attendance Records Table */}
            {loadingMyAttendance && (
              <div className="text-center py-8 text-gray-400">Loading attendance records...</div>
            )}

            {!loadingMyAttendance && myAttendanceRecords.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-4">Attendance History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-2 px-4">Date</th>
                        <th className="text-left py-2 px-4">Check In</th>
                        <th className="text-left py-2 px-4">Check Out</th>
                        <th className="text-left py-2 px-4">Work Hours</th>
                        <th className="text-left py-2 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myAttendanceRecords.map((record) => (
                        <tr key={record._id} className="border-b border-gray-700">
                          <td className="py-2 px-4">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 px-4">
                            {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}
                          </td>
                          <td className="py-2 px-4">
                            {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}
                          </td>
                          <td className="py-2 px-4">
                            {record.workHours ? `${record.workHours} hrs` : '-'}
                          </td>
                          <td className="py-2 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              record.status === 'PRESENT' 
                                ? 'bg-green-900/30 text-green-400'
                                : record.status === 'PARTIAL'
                                ? 'bg-yellow-900/30 text-yellow-400'
                                : 'bg-red-900/30 text-red-400'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!loadingMyAttendance && myAttendanceRecords.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Click "Load My Attendance Records" to view your attendance history
              </div>
            )}
          </div>
        )}

        {currentPage === 'time-off' && (
          <div className="max-w-7xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-4">Time Off</h2>
            <p className="text-gray-400">Time off management page coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}