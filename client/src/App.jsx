// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage'; // <-- IMPORT REGISTER PAGE
import HomePage from './pages/HomePage'; // <-- Import the new homepage

function App() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: { background: '#334155', color: '#f8fafc' },
        }}
      />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          {/* A landing page for unauthenticated users */}
          <Route path="/" element={<HomePage />} />
          {/* The login page remains public */}
          <Route path="/login" element={<LoginPage />} />
          {/* Add the register route */}
          <Route path="/register" element={<RegisterPage />} />

          {/* --- PROTECTED DASHBOARD ROUTE --- */}
          {/* The wildcard '/*' now matches all routes that BEGIN with /dashboard */}
          {/* e.g., /dashboard, /dashboard/alerts, /dashboard/reports, etc. */}
          <Route 
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;