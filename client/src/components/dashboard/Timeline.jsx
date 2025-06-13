// client/src/components/dashboard/Timeline.jsx

import React from 'react';
import Card from '../ui/Card';

const TimelineItem = ({ event, onEventClick }) => {
    const statusColor = {
        critical: 'border-danger',
        high: 'border-warning',
        info: 'border-info',
        success: 'border-success',
        medium: 'border-info',
    };

    return (
        <div onClick={() => onEventClick(event)} className="relative pl-8 pb-2 cursor-pointer hover:bg-dark-gray/20 p-2 rounded-md transition-colors">
             <div className="absolute left-[7px] top-6 bottom-0 w-0.5 bg-border -z-10"></div>
            <div className={`absolute left-0 top-1 w-4 h-4 rounded-full bg-card-bg border-2 ${statusColor[event.status] || 'border-gray-text'}`}></div>
            <p className="text-xs text-gray-text mb-1">{event.time}</p>
            <p className="font-semibold text-light">{event.title}</p>
            <p className="text-sm text-gray-text">{event.description}</p>
        </div>
    );
};


const Timeline = ({ events, onEventClick }) => {
    return (
        <Card title="Threat Timeline">
            <div className="relative h-[400px] overflow-y-auto pr-2 space-y-2">
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <TimelineItem key={index} event={event} onEventClick={onEventClick} />
                    ))
                ) : (
                     <p className="text-gray-text p-4 text-center">No high-severity events yet.</p>
                )}
            </div>
        </Card>
    );
};

export default Timeline;