import React, { useState } from 'react'
import { User, LogOut, Camera, Clock, Upload } from 'lucide-react';

export const ProfilePage = ({ currentUser, onUpdateProfile, onAvatarUpload }) => {

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
        <User className="w-16 h-16 text-gray-500" />
    </div>
    <label className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
        <input
        type="file"
        accept="image/*"
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
    )
};
