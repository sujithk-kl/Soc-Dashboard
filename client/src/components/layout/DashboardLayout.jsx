// client/src/components/layout/DashboardLayout.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

// Import all the pages that will be routed within this layout
import Dashboard from '../../pages/Dashboard';
import AlertsPage from '../../pages/placeholder/AlertsPage';
import ReportsPage from '../../pages/placeholder/ReportsPage';
import ThreatMapPage from '../../pages/placeholder/ThreatMapPage';
import LogManagementPage from '../../pages/placeholder/LogManagementPage';
import RbacPage from '../../pages/placeholder/RbacPage';
import SettingsPage from '../../pages/placeholder/SettingsPage';


const DashboardLayout = () => {
    return (
        <div className="dashboard-container grid grid-cols-[280px_1fr] h-screen overflow-hidden">
            <Sidebar />
            <div className="main-content flex flex-col overflow-hidden">
                <Header />
                <main className="dashboard-content p-6 overflow-y-auto flex-1 bg-dark">
                    <Routes>
                        {/* THE FIX IS HERE: The path for the dashboard index is now "/" relative to "/dashboard" */}
                        <Route path="/" element={<Dashboard />} />
                        
                        {/* All other paths are also relative */}
                        <Route path="alerts" element={<AlertsPage />} />
                        <Route path="threat-map" element={<ThreatMapPage />} />
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="log-management" element={<LogManagementPage />} />
                        <Route path="rbac" element={<RbacPage />} />
                        <Route path="settings" element={<SettingsPage />} />

                        <Route path="*" element={
                            <div className="p-6">
                                <h1 className="text-3xl font-bold text-light">Page Not Found</h1>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;