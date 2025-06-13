// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';

// Import the new placeholder pages
import AlertsPage from './pages/placeholder/AlertsPage';
import ReportsPage from './pages/placeholder/ReportsPage';
// Add other imports as you create them...

function App() {
  return (
    <Router>
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
              {/* Add other routes here...
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