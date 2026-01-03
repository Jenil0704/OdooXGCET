import React, { useEffect, useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import authApi from '../api/auth';

const Card = ({ employee, isCurrentUser }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 flex flex-col items-center space-y-2 border ${
      isCurrentUser ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-gray-700'
    } hover:border-gray-600 transition-colors`}>
      <div className="w-20 h-20 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
        {employee.avatar ? (
          <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-gray-500" />
        )}
      </div>
      <div className="text-center w-full">
        <h3 className="text-white font-medium truncate">{employee.name}</h3>
        <p className="text-gray-400 text-sm">{employee.role}</p>
      </div>
      {isCurrentUser && (
        <span className="text-xs bg-blue-600 px-2 py-1 rounded">You</span>
      )}
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${employee.status === 'checked-in' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
        <p className="text-xs text-gray-400">
          {employee.status === 'checked-in' ? 'Checked In' : 'Checked Out'}
        </p>
      </div>
    </div>
  );
};


const EmployeeCard = ({ employee, isCurrentUser }) => {
  const [employees, setEmployees] = useState([]);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [employeesError, setEmployeesError] = useState(null);
    const [currentPage, setCurrentPage] = useState('employees');

    const { logout, user } = useAuth();
    const [currentUserId, setCurrentUserId] = useState(null);

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

  return (
    <>
    {currentPage === 'employees' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Employees</h2>
            </div>

            {/* Employee Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
              {employees.map(employee => (
                <Card
                  key={employee.id}
                  employee={employee}
                  isCurrentUser={employee.id === currentUserId}
                />
              ))}
            </div>
          </div>
    )}
    </>

  );
};
export default EmployeeCard;