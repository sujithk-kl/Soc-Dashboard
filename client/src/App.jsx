// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'; // <-- IMPORT THE NEW HOMEPAGE

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
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- PROTECTED DASHBOARD ROUTE --- */}
          <Route 
            path="/dashboard/*" // All routes starting with /dashboard
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