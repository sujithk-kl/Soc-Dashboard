import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getThreatIntel } from '../../services/api'; // We will add this function next

const ThreatIntel = () => {
    const [intelData, setIntelData] = useState([]);

    useEffect(() => {
        const fetchIntel = async () => {
            try {
                const data = await getThreatIntel();
                setIntelData(data);
            } catch (error) {
                console.error("Failed to fetch threat intel:", error);
            }
        };
        fetchIntel();
    }, []);

    return (
        <Card title="Threat Intelligence">
            <div className="grid grid-cols-1 gap-4">
                {intelData.map((item, index) => (
                    <div key={index} className="bg-dark-gray/20 p-3 rounded-lg">
                        <p className="text-sm text-gray-text">{item.title}</p>
                        <p className="text-xl font-bold text-light">{item.value}</p>
                    </div>
                ))}
            </div>
        </Card>
    );
};

// This is the crucial line that fixes the error
export default ThreatIntel;