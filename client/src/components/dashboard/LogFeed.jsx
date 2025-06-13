// client/src/components/dashboard/LogFeed.jsx

import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../ui/Card';
import ThreatDetailModal from '../ui/ThreatDetailModal';

// This is just a UI piece now
const LogEntry = ({ log, onClick }) => {
    const severityClasses = {
        critical: 'bg-danger/10 text-danger',
        high: 'bg-warning/10 text-warning',
        medium: 'bg-info/10 text-info',
        low: 'bg-success/10 text-success',
    };

    return (
        <div className="flex gap-4 py-3 border-b border-border last:border-b-0 cursor-pointer hover:bg-dark-gray/20 px-2" onClick={() => onClick(log)}>
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${severityClasses[log.severity]}`}>
                <FontAwesomeIcon icon={['fas', log.icon]} />
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-light">{log.title}</p>
                    <p className="text-xs text-gray-text">{log.timestamp}</p>
                </div>
                <p className="text-sm text-gray-text">{log.description}</p>
                <div className="text-xs text-gray-text mt-1">
                    <span>SRC: {log.sourceIp}</span> → <span>DST: {log.destIp}</span>
                </div>
            </div>
        </div>
    );
};


// The LogFeed component now receives logs as a prop
const LogFeed = ({ logs }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const logContainerRef = useRef(null);

    // Scroll to top when new logs are added
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = 0;
        }
    }, [logs]);

    const handleLogClick = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <Card title="Real-Time Security Logs">
            <div ref={logContainerRef} className="h-[400px] overflow-y-auto">
                {logs.length > 0 ? (
                    logs.map(log => <LogEntry key={log.id} log={log} onClick={handleLogClick} />)
                ) : (
                    <p className="text-gray-text p-4 text-center">Waiting for new security events...</p>
                )}
            </div>
            {isModalOpen && <ThreatDetailModal threat={selectedLog} onClose={() => setIsModalOpen(false)} />}
        </Card>
    );
};

export default LogFeed;