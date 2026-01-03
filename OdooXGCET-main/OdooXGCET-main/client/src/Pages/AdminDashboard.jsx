import React, { useState, useEffect } from 'react';
import { User, LogOut, Camera, Clock, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/auth';
import attendanceApi from '../api/attendance';
import EmployeeCard from '../Components/EmployeeCard';
import { ProfilePage } from '../Components/AdminProfile';

// ==================== MAIN APP COMPONENT ====================
export default function Dashboard() {
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
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [allEmployeesAttendance, setAllEmployeesAttendance] = useState([]);
  const [loadingAllAttendance, setLoadingAllAttendance] = useState(false);

  

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

  const currentUser = employees.find(emp => emp.id === currentUserId);
  // Fetch today's attendance status
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      try {
        const response = await attendanceApi.getTodayAttendance();
        setTodayAttendance(response.data);
        // Update current user status
        if (currentUserId) {
          setEmployees(prev => prev.map(emp => 
            emp.id === currentUserId 
              ? { ...emp, status: response.data.isCheckedIn ? 'checked-in' : 'checked-out' }
              : emp
          ));
        }
      } catch (error) {
        console.error('Error fetching today attendance:', error);
      }
    };

    if (user) {
      fetchTodayAttendance();
    }
  }, [user, currentUserId]);

  const handleCheckIn = async () => {
    try {
      setLoadingAttendance(true);
      const response = await attendanceApi.checkIn();
      setTodayAttendance({
        isCheckedIn: true,
        isCheckedOut: false,
        checkIn: response.data.checkIn
      });
      setEmployees(prev => prev.map(emp => 
        emp.id === currentUserId ? { ...emp, status: 'checked-in' } : emp
      ));
      setAttendanceHistory(prev => [...prev, {
        type: 'check-in',
        timestamp: new Date(response.data.checkIn).toLocaleString(),
        date: new Date().toLocaleDateString()
      }]);
    } catch (error) {
      alert(error.message || 'Failed to check in');
      console.error('Check-in error:', error);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoadingAttendance(true);
      const response = await attendanceApi.checkOut();
      setTodayAttendance({
        isCheckedIn: true,
        isCheckedOut: true,
        checkIn: response.data.checkIn,
        checkOut: response.data.checkOut,
        workHours: response.data.workHours
      });
      setEmployees(prev => prev.map(emp => 
        emp.id === currentUserId ? { ...emp, status: 'checked-out' } : emp
      ));
      setAttendanceHistory(prev => [...prev, {
        type: 'check-out',
        timestamp: new Date(response.data.checkOut).toLocaleString(),
        date: new Date().toLocaleDateString()
      }]);
    } catch (error) {
      alert(error.message || 'Failed to check out');
      console.error('Check-out error:', error);
    } finally {
      setLoadingAttendance(false);
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

          <div className='flex items-center justify-center'>
            <button className='px-5 py-1.5 bg-blue-500 rounded-md cursor-pointer'>New</button>
          </div>
          {/* Check In/Out + User Profile - Fixed on all pages */}
          <div className="flex items-center space-x-3">
            {/* Check In/Out Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleCheckIn}
                disabled={todayAttendance?.isCheckedIn || loadingAttendance}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  todayAttendance?.isCheckedIn || loadingAttendance
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {loadingAttendance ? 'Processing...' : 'Check In'}
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todayAttendance?.isCheckedIn || todayAttendance?.isCheckedOut || loadingAttendance}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  !todayAttendance?.isCheckedIn || todayAttendance?.isCheckedOut || loadingAttendance
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {loadingAttendance ? 'Processing...' : 'Check Out'}
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
          <EmployeeCard/>
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
              <h2 className="text-2xl font-bold mb-2">Employees Attendance</h2>
              <p className="text-gray-400 text-sm">View attendance records</p>
            </div>

            {/* Fetch All Attendance Button */}
            <div className="mb-4">
              <button
                onClick={async () => {
                  try {
                    setLoadingAllAttendance(true);
                    const response = await attendanceApi.getAllEmployeesAttendance();
                    setAllEmployeesAttendance(response.data.attendance || []);
                  } catch (error) {
                    console.error('Error fetching attendance:', error);
                    alert('Failed to fetch attendance records');
                  } finally {
                    setLoadingAllAttendance(false);
                  }
                }}
                disabled={loadingAllAttendance}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-600"
              >
                {loadingAllAttendance ? 'Loading...' : 'Load Attendance Records'}
              </button>
            </div>

            {/* Attendance Records */}
            {loadingAllAttendance && (
              <div className="text-center py-8 text-gray-400">Loading attendance records...</div>
            )}

            {!loadingAllAttendance && allEmployeesAttendance.length > 0 && (
              <div className="space-y-4">
                {allEmployeesAttendance.map((employeeData, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">
                        {employeeData.employee.firstName} {employeeData.employee.lastName}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Code: {employeeData.employee.employeeCode} | {employeeData.employee.email}
                      </p>
                    </div>
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
                          {employeeData.records.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="text-center py-4 text-gray-400">
                                No attendance records
                              </td>
                            </tr>
                          ) : (
                            employeeData.records.map((record) => (
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
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loadingAllAttendance && allEmployeesAttendance.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                Click "Load Attendance Records" to view attendance data
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