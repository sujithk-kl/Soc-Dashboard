import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getTimelineEvents } from '../../services/api'; // We will also add this

const TimelineItem = ({ time, title, description, status }) => {
    const statusColor = {
        critical: 'border-danger',
        high: 'border-warning',
        info: 'border-info',
        success: 'border-success',
        medium: 'border-info',
    };

    return (
        <div className="relative pl-8">
            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-card-bg border-2 ${statusColor[status] || 'border-gray-text'}`}></div>
            <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-border"></div>
            <p className="text-xs text-gray-text mb-1">{time}</p>
            <p className="font-semibold text-light">{title}</p>
            <p className="text-sm text-gray-text">{description}</p>
        </div>
    );
};


const Timeline = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getTimelineEvents();
                setEvents(data);
            } catch (error) {
                console.error("Failed to fetch timeline events:", error);
            }
        };
        fetchEvents();
    }, []);

    return (
        <Card title="Threat Timeline">
            <div className="space-y-6">
                {events.map((event, index) => (
                    <TimelineItem key={index} {...event} />
                ))}
            </div>
        </Card>
    );
};

export default Timeline;