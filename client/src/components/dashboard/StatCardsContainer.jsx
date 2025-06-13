// client/src/components/dashboard/StatCardsContainer.jsx

import React, { useState, useEffect, useRef } from 'react';
import { getStats } from '../../services/api';
import useSocket from '../../hooks/useSocket';
import StatCard from './StatCard';

const StatCardsContainer = () => {
    // State to hold the array of stat objects
    const [stats, setStats] = useState([]);

    // Listen for real-time updates for the 'update_stats' event
    const newStatsData = useSocket('update_stats');

    // Use a ref to track if a real-time update has already been processed
    const hasReceivedRealtimeUpdate = useRef(false);

    // Effect for fetching the *initial* data when the component first loads.
    useEffect(() => {
        const fetchAndSetInitialData = async () => {
            const initialData = await getStats();
            
            // THE FIX: Only set the initial data if no real-time update has come in yet.
            if (!hasReceivedRealtimeUpdate.current) {
                setStats(initialData);
            }
        };
        
        fetchAndSetInitialData();
    }, []); // Empty dependency array ensures this runs only once on mount.

    // Effect for handling *real-time* updates from the WebSocket.
    useEffect(() => {
        // If new stat data has arrived from the socket, update our state.
        if (newStatsData && newStatsData.length > 0) {
            setStats(newStatsData);
            
            // Mark that we have received at least one real-time update.
            // This prevents the initial fetch from overwriting this new data.
            hasReceivedRealtimeUpdate.current = true;
        }
    }, [newStatsData]); // This dependency array is crucial.

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.length > 0 ? (
                stats.map((stat) => (
                    // Use stat.title as a key since it's unique
                    <StatCard key={stat.title} {...stat} />
                ))
            ) : (
                // Show placeholders while loading
                Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="bg-card-bg border border-border rounded-lg p-4 h-28 animate-pulse">
                         <div className="h-4 bg-gray-text/20 rounded w-3/4 mb-4"></div>
                         <div className="h-8 bg-gray-text/20 rounded w-1/2"></div>
                    </div>
                ))
            )}
        </div>
    );
};

export default StatCardsContainer;