// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RootLoginPage from './pages/RootLoginPage';
import IamLoginPage from './pages/IamLoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

// Import the placeholder pages here at the top level
import Dashboard from './pages/Dashboard';
import AlertsPage from './pages/placeholder/AlertsPage';
import ReportsPage from './pages/placeholder/ReportsPage';
import LogManagementPage from './pages/placeholder/LogManagementPage';
import RbacPage from './pages/placeholder/RbacPage';
import { useAuth } from './contexts/AuthContext';
import SettingsPage from './pages/placeholder/SettingsPage';


function App() {
  const { user, ROLES } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{ style: { background: '#334155', color: '#f8fafc' } }}
      />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/root" element={<RootLoginPage />} />
          <Route path="/login/iam" element={<IamLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* --- PROTECTED LAYOUT ROUTE --- */}
          {/* This is the new, more stable structure. The DashboardLayout component
              now acts as a wrapper for all its child routes. */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Child routes are now nested directly here */}
            <Route index element={<Dashboard />} /> 
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="log-management" element={<LogManagementPage />} />
            {isAdmin && <Route path="rbac" element={<RbacPage />} />}
            <Route path="settings" element={<SettingsPage />} />

            {/* A catch-all for any page not found within /dashboard */}
            <Route path="*" element={
              <div className="p-6">
                  <h1 className="text-3xl font-bold text-light">Page Not Found</h1>
              </div>
            } />
          </Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;