// client/src/components/dashboard/ThreatIntel.jsx

import React, { useState, useEffect, useRef } from 'react';
import Card from '../ui/Card';
import { getThreatIntel } from '../../services/api';
import useSocket from '../../hooks/useSocket';

const ThreatIntel = () => {
    const [intelData, setIntelData] = useState([]);
    const newIntelData = useSocket('update_intel');
    const hasReceivedRealtimeUpdate = useRef(false);

    // Effect to fetch initial data
    useEffect(() => {
        const fetchAndSetInitialData = async () => {
            const initialData = await getThreatIntel();
            if (!hasReceivedRealtimeUpdate.current) {
                setIntelData(initialData);
            }
        };
        fetchAndSetInitialData();
    }, []);

    // Effect to handle real-time updates
    useEffect(() => {
        if (newIntelData && newIntelData.length > 0) {
            setIntelData(newIntelData);
            hasReceivedRealtimeUpdate.current = true;
        }
    }, [newIntelData]);

    return (
        <Card title="Threat Intelligence">
            <div className="space-y-4">
                {intelData.length > 0 ? (
                    // The .map() function provides a second argument: the index.
                    intelData.map((item, index) => (
                        // --- THE DEFINITIVE FIX ---
                        // We are creating a key that is guaranteed to be unique
                        // by combining the item's title with its index in the array.
                        // The key is on the outermost element being returned by the map.
                        <div key={`${item.title}-${index}`} className="bg-dark-gray/20 p-3 rounded-lg">
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