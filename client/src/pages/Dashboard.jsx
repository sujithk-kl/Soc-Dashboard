// client/src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import StatCardsContainer from '../components/dashboard/StatCardsContainer'; 
import LogFeed from '../components/dashboard/LogFeed';
import AlertsList from '../components/dashboard/AlertsList'; // This will now be a "dumb" component
import ThreatMap from '../components/dashboard/ThreatMap';
import ThreatIntel from '../components/dashboard/ThreatIntel';
import Timeline from '../components/dashboard/Timeline';
import { getTimelineEvents, getAlerts } from '../services/api'; // Import getAlerts
import useSocket from '../hooks/useSocket';

const Dashboard = () => {
    // State managed by the parent Dashboard component
    const [logs, setLogs] = useState([]);
    const [timelineEvents, setTimelineEvents] = useState([]);
    const [alerts, setAlerts] = useState([]); // <-- NEW STATE FOR ALERTS

    // Listen for real-time log events
    const newLog = useSocket('new_log');

    // --- INITIAL DATA FETCHING ---
    useEffect(() => {
        // Fetch initial data for Timeline
        const fetchInitialTimeline = async () => {
            const initialEvents = await getTimelineEvents();
            setTimelineEvents(initialEvents);
        };
        // Fetch initial data for Alerts
        const fetchInitialAlerts = async () => {
            const initialAlerts = await getAlerts();
            setAlerts(initialAlerts);
        };

        fetchInitialTimeline();
        fetchInitialAlerts(); // Call the new fetch function
    }, []);

    // --- REAL-TIME UPDATE HANDLING ---
    useEffect(() => {
        if (newLog) {
            // 1. Update the main log feed
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);

            // 2. Update Timeline and Alerts only for high-severity events
            if (newLog.severity === 'critical' || newLog.severity === 'high') {
                
                // Add to timeline
                const newTimelineEvent = {
                    time: newLog.timestamp,
                    title: newLog.title,
                    description: `Source: ${newLog.sourceIp}`,
                    status: newLog.severity,
                };
                setTimelineEvents(prevEvents => [newTimelineEvent, ...prevEvents.slice(0, 5)]);

                // 3. Add to Recent Security Alerts
                const newAlert = {
                    id: newLog.id,
                    title: newLog.title,
                    description: newLog.description,
                    source: 'Real-time Feed', // Source is the live feed
                    severity: newLog.severity,
                    status: 'open', // New alerts are always 'open'
                };
                setAlerts(prevAlerts => [newAlert, ...prevAlerts.slice(0, 4)]); // Keep max 5 alerts
            }
        }
    }, [newLog]);

    return (
        <div>
            <StatCardsContainer />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <LogFeed logs={logs} />
                    <Timeline events={timelineEvents} />
                </div>

                <div className="space-y-6">
                    <ThreatMap />
                    {/* Pass the managed 'alerts' state down as a prop */}
                    <AlertsList alerts={alerts} />
                    <ThreatIntel />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;