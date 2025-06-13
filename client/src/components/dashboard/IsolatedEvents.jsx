// client/src/components/dashboard/IsolatedEvents.jsx

import React from 'react';
import Card from '../ui/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

const IsolatedEvents = ({ isolatedEvents }) => {
    return (
        <Card title="Isolated Events">
            <div className="h-[300px] overflow-y-auto pr-2 space-y-2">
                {isolatedEvents && isolatedEvents.length > 0 ? (
                    isolatedEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-3 p-2 bg-dark-gray/30 rounded-md">
                            <FontAwesomeIcon icon={faLock} className="text-warning" />
                            <div className="flex-grow">
                                <p className="font-semibold text-light">{event.title}</p>
                                <p className="text-xs text-gray-text">IP: {event.sourceIp || 'N/A'}</p>
                            </div>
                            <span className="text-xs text-gray-text">{event.timestamp || event.time}</span>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-text">
                        <p>No hosts have been isolated.</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default IsolatedEvents;