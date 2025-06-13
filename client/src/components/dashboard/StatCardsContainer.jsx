// client/src/components/dashboard/StatCardsContainer.jsx

import React, { useState, useEffect } from 'react';
import { getStats } from '../../services/api';
import useSocket from '../../hooks/useSocket'; // Import the socket hook
import StatCard from './StatCard';

const StatCardsContainer = () => {
    const [stats, setStats] = useState([]);
    
    // Listen for the 'update_stats' event from the WebSocket
    const newStats = useSocket('update_stats');

    // 1. Fetch initial stats on component mount
    useEffect(() => {
        const fetchInitialStats = async () => {
            const initialData = await getStats();
            setStats(initialData);
        };
        fetchInitialStats();
    }, []);

    // 2. This effect runs whenever newStats arrive from the socket
    useEffect(() => {
        // If we have received new stats, update the state
        if (newStats) {
            setStats(newStats);
        }
    }, [newStats]); // Dependency array ensures this runs only when `newStats` changes

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default StatCardsContainer;