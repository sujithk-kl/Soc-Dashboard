// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // <-- IMPORT TOAST
import StatCardsContainer from '../components/dashboard/StatCardsContainer';
import LogFeed from '../components/dashboard/LogFeed';
import AlertsList from '../components/dashboard/AlertsList';
import ThreatMap from '../components/dashboard/ThreatMap';
import ThreatIntel from '../components/dashboard/ThreatIntel';
import Timeline from '../components/dashboard/Timeline';
import IsolatedEvents from '../components/dashboard/IsolatedEvents'; // <-- IMPORT NEW COMPONENT
import ThreatDetailModal from '../components/ui/ThreatDetailModal';
import { getTimelineEvents, getAlerts } from '../services/api';
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
    // State for data
    const [logs, setLogs] = useState([]);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [threatMarkers, setThreatMarkers] = useState([]);
    const [isolatedEvents, setIsolatedEvents] = useState([]); // <-- NEW STATE for isolated events

    // State for the Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const newLog = useSocket('new_log');

    // Universal Click Handler
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    // --- ISOLATION LOGIC ---
    const handleIsolateEvent = (eventToIsolate) => {
        // 1. Add to the isolated list for tracking
        setIsolatedEvents(prev => [eventToIsolate, ...prev]);

        // 2. Remove from all active feeds to "quarantine" it
        setLogs(prev => prev.filter(e => e.id !== eventToIsolate.id));
        setAlerts(prev => prev.filter(e => e.id !== eventToIsolate.id));
        setTimelineEvents(prev => prev.filter(e => e.id !== eventToIsolate.id));
        setThreatMarkers(prev => prev.filter(e => e.id !== eventToIsolate.id));

        // 3. Show a confirmation toast notification
        toast.success(`Host ${eventToIsolate.sourceIp || ''} isolated successfully!`);
    };

    // Initial data fetching
    useEffect(() => {
        const fetchInitialTimeline = async () => setTimelineEvents(await getTimelineEvents());
        const fetchInitialAlerts = async () => setAlerts(await getAlerts());
        fetchInitialTimeline();
        fetchInitialAlerts();
    }, []);

    // Real-time update handling
    useEffect(() => {
        if (newLog) {
            // Update main log feed
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);

            // Add new marker to map if location exists
            if (newLog.location) {
                const newMarker = {
                    id: newLog.id,
                    pos: [newLog.location.lat, newLog.location.lng],
                    title: newLog.title,
                    severity: newLog.severity,
                };
                setThreatMarkers(prevMarkers => [newMarker, ...prevMarkers.slice(0, 19)]);
            }

            // Update other components for high-severity events
            if (newLog.severity === 'critical' || newLog.severity === 'high') {
                setTimelineEvents(prevEvents => [{ ...newLog, time: newLog.timestamp }, ...prevEvents.slice(0, 5)]);

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
                    {/* Add the new component to the layout */}
                    <IsolatedEvents isolatedEvents={isolatedEvents} />
                </div>

                <div className="space-y-6">
                    <ThreatMap markers={threatMarkers} />
                    <AlertsList alerts={alerts} onEventClick={handleEventClick} />
                    <ThreatIntel />
                </div>
            </div>

            {/* Render the modal conditionally and pass the new handler */}
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