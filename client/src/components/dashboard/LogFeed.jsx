import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Card from '../ui/Card';
import useSocket from '../../hooks/useSocket';
import ThreatDetailModal from '../ui/ThreatDetailModal';

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
                <FontAwesomeIcon icon={log.icon} />
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

const LogFeed = () => {
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const newLog = useSocket('new_log');
    const logContainerRef = useRef(null);

    useEffect(() => {
        if (newLog) {
            setLogs(prevLogs => [newLog, ...prevLogs.slice(0, 19)]);
            if (logContainerRef.current) {
                logContainerRef.current.scrollTop = 0;
            }
        }
    }, [newLog]);

    const handleLogClick = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <Card title="Real-Time Security Logs">
            <div ref={logContainerRef} className="h-[400px] overflow-y-auto">
                {logs.map(log => <LogEntry key={log.id} log={log} onClick={handleLogClick} />)}
            </div>
            {isModalOpen && <ThreatDetailModal threat={selectedLog} onClose={() => setIsModalOpen(false)} />}
        </Card>
    );
};

export default LogFeed;