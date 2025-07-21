// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { isolateHostAction } from '../services/api';
import useSocket from '../hooks/useSocket';

// Import all layout and dashboard components
import StatCardsContainer from '../components/dashboard/StatCardsContainer';
import LogFeed from '../components/dashboard/LogFeed';
import AlertsList from '../components/dashboard/AlertsList';
import ThreatMap from '../components/dashboard/ThreatMap';
import Timeline from '../components/dashboard/Timeline';
import IsolatedEvents from '../components/dashboard/IsolatedEvents';
import ThreatDetailModal from '../components/ui/ThreatDetailModal';

const Dashboard = () => {
    const { user } = useAuth();

    // State for all dynamic data, initialized as empty arrays
    const [logs, setLogs] = useState([]);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [threatMarkers, setThreatMarkers] = useState([]);
    const [isolatedEvents, setIsolatedEvents] = useState([]);

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
            setIsolatedEvents(prev => [eventToIsolate, ...prev]);
            setLogs(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setAlerts(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setTimelineEvents(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setThreatMarkers(prev => prev.filter(e => e.id !== eventToIsolate.id));

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

    // This hook is intentionally left empty, as per your request
    // for timeline/alerts to start empty.
    useEffect(() => { }, []);

    // This hook handles all real-time updates from WebSockets
    useEffect(() => {
        if (newLog) {
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);

            if (newLog.location) {
                const newMarker = { id: newLog.id, pos: [newLog.location.lat, newLog.location.lng], title: newLog.title, severity: newLog.severity };
                setThreatMarkers(prevMarkers => [newMarker, ...prevMarkers.slice(0, 19)]);
            }

            if (newLog.severity === 'critical' || newLog.severity === 'high') {
                setTimelineEvents(prevEvents => [{...newLog, time: newLog.timestamp}, ...prevEvents.slice(0, 5)]);

                const newAlert = { id: newLog.id, title: newLog.title, description: newLog.description, source: 'Real-time Feed', severity: newLog.severity, status: 'open' };
                setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 4)]);
            }
        }
    }, [newLog]);


    return (
        <div className="relative">
            <StatCardsContainer />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LogFeed logs={logs} onEventClick={handleEventClick} />
                    <Timeline events={timelineEvents} onEventClick={handleEventClick} />
                    {/* The Isolated Events card is now part of the layout */}
                    <IsolatedEvents isolatedEvents={isolatedEvents} />
                </div>

                <div className="space-y-6">
                    <ThreatMap markers={threatMarkers} />
                    <AlertsList alerts={alerts} onEventClick={handleEventClick} />
                </div>
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