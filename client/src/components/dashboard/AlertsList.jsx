// client/src/components/dashboard/AlertsList.jsx

import React from 'react';
import Card from '../ui/Card';

const AlertsList = ({ alerts, onEventClick }) => {
    const severityClasses = {
        critical: 'bg-danger',
        high: 'bg-warning',
        medium: 'bg-info',
        low: 'bg-success',
    };
    const statusClasses = {
        open: 'text-danger',
        investigating: 'text-warning',
        resolved: 'text-success',
    };
    
    return (
        <Card title="Recent Security Alerts">
            <div className="space-y-2">
                {alerts && alerts.length > 0 ? (
                    alerts.map(alert => (
                        <div key={alert.id} onClick={() => onEventClick(alert)} className="flex gap-3 cursor-pointer hover:bg-dark-gray/20 p-2 rounded-md transition-colors">
                            <div className={`w-2 flex-shrink-0 rounded-full ${severityClasses[alert.severity]}`}></div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-baseline">
                                    <p className="font-semibold text-light">{alert.title}</p>
                                    <span className={`text-xs font-medium ${statusClasses[alert.status]}`}>{alert.status}</span>
                                </div>
                                <p className="text-sm text-gray-text">{alert.description}</p>
                                <p className="text-xs text-gray-text mt-1">Source: {alert.source}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-text text-center py-4">No recent alerts.</p>
                )}
            </div>
        </Card>
    );
};

export default AlertsList;