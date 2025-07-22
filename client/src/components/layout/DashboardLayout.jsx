// client/src/components/layout/DashboardLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- IMPORT Outlet
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = () => {
    return (
        <div className="dashboard-container grid grid-cols-[280px_1fr] h-screen overflow-hidden">
            <Sidebar />
            <div className="main-content flex flex-col overflow-hidden">
                <Header />
                <main className="dashboard-content p-6 overflow-y-auto flex-1 bg-dark">
                    {/* --- THE FIX IS HERE --- */}
                    {/* Outlet tells React Router where to render the matched child route */}
                    {/* (e.g., <Dashboard />, <AlertsPage />, etc.) */}
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;