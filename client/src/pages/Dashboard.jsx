// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { isolateHostAction } from '../services/api';
import useSocket from '../hooks/useSocket';
import StatCardsContainer from '../components/dashboard/StatCardsContainer';
import LogFeed from '../components/dashboard/LogFeed';
import AlertsList from '../components/dashboard/AlertsList';
import ThreatMap from '../components/dashboard/ThreatMap';
import ThreatIntel from '../components/dashboard/ThreatIntel';
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

    // Opens the detail modal when any event is clicked
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    // Closes the detail modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };
    
    // The complete "Isolate Host" function
    const handleIsolateEvent = async (eventToIsolate) => {
        try {
            // 1. Call the protected API endpoint for backend action
            const result = await isolateHostAction(eventToIsolate, user.role);

            // 2. If successful, update all relevant UI states
            setIsolatedEvents(prev => [eventToIsolate, ...prev]);
            setLogs(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setAlerts(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setTimelineEvents(prev => prev.filter(e => e.id !== eventToIsolate.id));
            setThreatMarkers(prev => prev.filter(e => e.id !== eventToIsolate.id));

            // 3. Show a success notification from the server's response
            toast.success(result.message);
        } catch (error) {
            // Show an error notification if the API call fails (e.g., RBAC permission denied)
            toast.error(error.message);
        }
    };

    // --- USE EFFECT HOOKS ---

    // This hook is intentionally left empty, ensuring alerts and timeline start empty.
    useEffect(() => {
        // StatCardsContainer and ThreatIntel still fetch their own initial data.
    }, []);

    // This hook handles all real-time updates when a new log arrives.
    useEffect(() => {
        if (newLog) {
            // Add to the main Real-Time Security Logs feed
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);

            // Add a marker to the map if the log has location data
            if (newLog.location) {
                const newMarker = {
                    id: newLog.id,
                    pos: [newLog.location.lat, newLog.location.lng],
                    title: newLog.title,
                    severity: newLog.severity,
                };
                setThreatMarkers(prevMarkers => [newMarker, ...prevMarkers.slice(0, 19)]);
            }

            // For high-severity events, also add them to the Timeline and Alerts list
            if (newLog.severity === 'critical' || newLog.severity === 'high') {
                // Add to Timeline
                setTimelineEvents(prevEvents => [{...newLog, time: newLog.timestamp}, ...prevEvents.slice(0, 5)]);

                // Add to Recent Security Alerts
                const newAlert = {
                    id: newLog.id,
                    title: newLog.title,
                    description: newLog.description,
                    source: 'Real-time Feed',
                    severity: newLog.severity,
                    status: 'open',
                };
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
                    <IsolatedEvents isolatedEvents={isolatedEvents} />
                </div>

                <div className="space-y-6">
                    <ThreatMap markers={threatMarkers} />
                    <AlertsList alerts={alerts} onEventClick={handleEventClick} />
                    <ThreatIntel />
                </div>
            </div>

            {/* The modal receives all necessary props, including the isolation handler */}
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