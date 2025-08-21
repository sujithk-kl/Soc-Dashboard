// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { isolateHostAction, getWindowsSecurityEvents, getWindowsDefenderEvents, getSmartScreenEvents } from '../services/api';
import useSocket from '../hooks/useSocket';

// Import all layout and dashboard components
import StatCardsContainer from '../components/dashboard/StatCardsContainer';
import LogFeed from '../components/dashboard/LogFeed';
import ThreatDetailModal from '../components/ui/ThreatDetailModal';

const Dashboard = () => {
    const { user } = useAuth();

    // State for all dynamic data, initialized as empty arrays
    const [logs, setLogs] = useState([]);

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Listen for new logs from the WebSocket
    const newLog = useSocket('new_log');


    // --- HANDLER FUNCTIONS ---

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };
    
    // --- THIS IS THE RESTORED ISOLATE FUNCTION ---
    const handleIsolateEvent = async (eventToIsolate) => {
        try {
            // 1. Call the protected API endpoint
            const result = await isolateHostAction(eventToIsolate, user.role);

            // 2. If API call is successful, update all relevant UI states
            setLogs(prev => prev.filter(e => e.id !== eventToIsolate.id));

            // 3. Show a success notification
            toast.success(result.message);
        } catch (error) {
            // Show an error notification if the API call fails
            toast.error(error.message || 'Failed to isolate host.');
        } finally {
            // Always close the modal
            handleCloseModal();
        }
    };


    // --- USE EFFECT HOOKS ---

    // Periodically poll Windows Security events and prepend to logs
    useEffect(() => {
        let isMounted = true;
        const fetchEvents = async () => {
            try {
                const [sec, def, ss] = await Promise.all([
                    getWindowsSecurityEvents(),
                    getWindowsDefenderEvents(),
                    getSmartScreenEvents()
                ]);
                const events = [...(sec||[]), ...(def||[]), ...(ss||[])];
                if (!isMounted || events.length === 0) return;
                // Keep most recent 100 entries
                setLogs(prev => {
                    const merged = [...events, ...prev];
                    const uniqueById = new Map();
                    for (const e of merged) uniqueById.set(e.id, e);
                    return Array.from(uniqueById.values()).slice(0, 100);
                });
            } catch (_) {}
        };
        fetchEvents();
        const interval = setInterval(fetchEvents, 5000);
        return () => { isMounted = false; clearInterval(interval); };
    }, []);

    // This hook handles all real-time updates from WebSockets (kept for simulated logs if any)
    useEffect(() => {
        if (newLog) {
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 99)]);
        }
    }, [newLog]);


    return (
        <div className="relative">
            <StatCardsContainer />

            <div className="space-y-6">
                <LogFeed logs={logs} onEventClick={handleEventClick} />
            </div>

            {/* The modal correctly receives the onIsolate prop */}
            {isModalOpen && 
                <ThreatDetailModal 
                    event={selectedEvent} 
                    onClose={handleCloseModal} 
                    onIsolate={handleIsolateEvent} 
                />
            }
        </div>
    );
};

export default Dashboard;