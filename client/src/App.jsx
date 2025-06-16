// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';

function App() {
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
          <Route path="/register" element={<RegisterPage />} />

          {/* --- PROTECTED DASHBOARD ROUTE --- */}
          {/* Any URL starting with /dashboard/ will be handled here */}
          <Route 
            path="/dashboard/*"
            element={ <ProtectedRoute> <DashboardLayout /> </ProtectedRoute> } 
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;