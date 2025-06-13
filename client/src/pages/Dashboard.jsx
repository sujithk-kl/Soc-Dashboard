// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import StatCard from '../components/dashboard/StatCard';
import LogFeed from '../components/dashboard/LogFeed';
import AlertsList from '../components/dashboard/AlertsList';
import ThreatMap from '../components/dashboard/ThreatMap';
import ThreatIntel from '../components/dashboard/ThreatIntel'; // This will now work
import Timeline from '../components/dashboard/Timeline';       // This will now work
import { getStats } from '../services/api';

const Dashboard = () => {
    // ... rest of the component is unchanged
    const [stats, setStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getStats();
            setStats(data);
        };
        fetchStats();
    }, []);

    return (
        <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left and Middle Columns */}
                <div className="lg:col-span-2 space-y-6">
                    <LogFeed />
                    <Timeline />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <ThreatMap />
                    <AlertsList />
                    <ThreatIntel />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;