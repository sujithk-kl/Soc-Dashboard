// client/src/components/layout/DashboardLayout.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../../pages/Dashboard';
import AlertsPage from '../../pages/placeholder/AlertsPage';
// ... other page imports

const DashboardLayout = () => {
    return (
        <div className="dashboard-container grid grid-cols-[280px_1fr] h-screen overflow-hidden">
            <Sidebar />
            <div className="main-content flex flex-col overflow-hidden">
                <Header />
                <main className="dashboard-content p-6 overflow-y-auto flex-1 bg-dark">
                    <Routes>
                        {/* THE FIX: path="/" here now refers to "/dashboard/" from App.jsx */}
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/alerts" element={<AlertsPage />} />
                        {/* ... other protected routes will work correctly here */}
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;