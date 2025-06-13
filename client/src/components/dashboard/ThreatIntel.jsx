// client/src/components/dashboard/ThreatIntel.jsx

import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { getThreatIntel } from '../../services/api';
import useSocket from '../../hooks/useSocket';

const ThreatIntel = () => {
    const [intelData, setIntelData] = useState([]);
    const newIntelData = useSocket('update_intel');
    const hasReceivedRealtimeUpdate = useRef(false);

    // Effect for fetching the initial data.
    useEffect(() => {
        const fetchAndSetInitialData = async () => {
            const initialData = await getThreatIntel();
            // Only set initial data IF no real-time update has come in yet.
            if (!hasReceivedRealtimeUpdate.current) {
                setIntelData(initialData);
            }
        };
        fetchAndSetInitialData();
    }, []); // Runs only once.

    // Effect for handling real-time updates.
    useEffect(() => {
        if (newIntelData && newIntelData.length > 0) {
            setIntelData(newIntelData);
            // Mark that a real-time update has been processed.
            hasReceivedRealtimeUpdate.current = true;
        }
    }, [newIntelData]);

    return (
        <Card title="Threat Intelligence">
            <div className="space-y-4">
                {intelData.length > 0 ? (
                    intelData.map((item) => (
                        <div key={item.title} className="bg-dark-gray/20 p-3 rounded-lg">
                            <p className="text-sm text-gray-text">{item.title}</p>
                            <p className="text-xl font-bold text-light">{item.value}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-text py-4">
                        <p>Connecting to Threat Intel Feed...</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ThreatIntel;