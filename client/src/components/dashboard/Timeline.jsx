// client/src/components/dashboard/Timeline.jsx

import React from 'react';
import Card from '../ui/Card';

const TimelineItem = ({ time, title, description, status }) => {
    const statusColor = {
        critical: 'border-danger',
        high: 'border-warning',
        info: 'border-info',
        success: 'border-success',
        medium: 'border-info',
    };

    return (
        <div className="relative pl-8 pb-4 last:pb-0">
             <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-border -z-10"></div>
            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-card-bg border-2 ${statusColor[status] || 'border-gray-text'}`}></div>
            <p className="text-xs text-gray-text mb-1">{time}</p>
            <p className="font-semibold text-light">{title}</p>
            <p className="text-sm text-gray-text">{description}</p>
        </div>
    );
};

// The Timeline component now receives events as a prop
const Timeline = ({ events }) => {
    return (
        <Card title="Threat Timeline">
            <div className="relative h-[400px] overflow-y-auto">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <TimelineItem key={index} {...event} />
                    ))
                ) : (
                     <p className="text-gray-text p-4 text-center">No high-severity events yet.</p>
                )}
            </div>
        </Card>
    );
};

export default Timeline;