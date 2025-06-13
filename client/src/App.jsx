// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // <-- IMPORT TOASTER
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';

// Import the placeholder pages
import AlertsPage from './pages/placeholder/AlertsPage';
import ReportsPage from './pages/placeholder/ReportsPage';
// Add other imports as you create them...
// import LogManagementPage from './pages/placeholder/LogManagementPage';
// import RbacPage from './pages/placeholder/RbacPage';
// import SettingsPage from './pages/placeholder/SettingsPage';

function App() {
  return (
    <Router>
      {/* The Toaster component is placed here to be available on all routes */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#334155', // e.g., slate-700
            color: '#f8fafc',      // e.g., slate-50
          },
        }}
      />
      <div className="dashboard-container grid grid-cols-[280px_1fr] h-screen overflow-hidden">
        <Sidebar />
        <div className="main-content flex flex-col overflow-hidden">
          <Header />
          <main className="dashboard-content p-6 overflow-y-auto flex-1 bg-dark">
            <Routes>
              {/* The main dashboard route */}
              <Route path="/" element={<Dashboard />} />

              {/* Routes for the other pages */}
              <Route path="/alerts" element={<AlertsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              {/* Add other routes here as you build them...
              <Route path="/log-management" element={<LogManagementPage />} />
              <Route path="/rbac" element={<RbacPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              */}
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;