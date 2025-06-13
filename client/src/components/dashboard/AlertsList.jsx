import React, { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { getAlerts } from '../../services/api';

const severityClasses = {
    critical: 'bg-danger',
    high: 'bg-warning',
    medium: 'bg-info',
    low: 'bg-success',
};
const statusClasses = {
    open: 'bg-danger/10 text-danger',
    investigating: 'bg-warning/10 text-warning',
    resolved: 'bg-success/10 text-success',
};

const AlertsList = () => {
    const [alerts, setAlerts] = useState([]);
    useEffect(() => {
        const fetchAlerts = async () => setAlerts(await getAlerts());
        fetchAlerts();
    }, []);

    return (
        <Card title="Recent Security Alerts">
            <div className="space-y-4">
                {alerts.map(alert => (
                    <div key={alert.id} className="flex gap-3">
                        <div className={`w-2 rounded-full ${severityClasses[alert.severity]}`}></div>
                        <div className="flex-grow">
                            <p className="font-semibold text-light">{alert.title}</p>
                            <p className="text-sm text-gray-text">{alert.description}</p>
                            <div className="flex justify-between items-center mt-1 text-xs">
                                <span className="text-gray-text">Source: {alert.source}</span>
                                <span className={`px-2 py-1 rounded-full font-medium ${statusClasses[alert.status]}`}>{alert.status}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default AlertsList;