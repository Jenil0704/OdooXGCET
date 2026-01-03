import React from 'react';
import Login from './Pages/Login.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Pages/Signup.jsx';
import Dashboard from './Pages/AdminDashboard.jsx';
import EmployeeDashboard from './Pages/EmployeeDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext';

// Component to redirect authenticated users away from login
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Redirect based on role
    if (user?.role === 'HR') {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (user?.role === 'EMPLOYEE') {
      return <Navigate to="/employee-dashboard" replace />;
    }
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - redirect if already authenticated */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute requiredRole="HR">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employee-dashboard" 
          element={
            <ProtectedRoute requiredRole="EMPLOYEE">
              <EmployeeDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Signup page - only accessible to HR */}
        <Route 
          path="/signup" 
          element={
            <ProtectedRoute requiredRole="HR">
              <Signup />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;