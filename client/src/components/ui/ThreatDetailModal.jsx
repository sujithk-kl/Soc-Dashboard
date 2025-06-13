// client/src/components/ui/ThreatDetailModal.jsx

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faShieldAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

// Helper component for displaying rows of data cleanly
const DetailRow = ({ label, value, children }) => {
    if (!value && !children) return null;
    return (
        <div className="grid grid-cols-3 gap-2 py-2 border-b border-border/50">
            <dt className="text-sm font-medium text-gray-text">{label}</dt>
            <dd className="col-span-2 text-sm text-light break-words">{children || value}</dd>
        </div>
    );
};

// The main modal component
const ThreatDetailModal = ({ event, onClose, onIsolate }) => { // <-- Add onIsolate prop
    if (!event) return null;

    // Create a normalized data object to handle different event structures
    const details = {
        title: event.title || 'Event Details',
        severity: event.severity || event.status || 'info',
        timestamp: event.timestamp || event.time || new Date().toLocaleTimeString(),
        description: event.description || 'No description available.',
        sourceIp: event.sourceIp,
        destIp: event.destIp,
        source: event.source,
    };

    const severityStyles = {
        critical: { text: 'text-danger', bg: 'bg-danger/10', border: 'border-danger' },
        high: { text: 'text-warning', bg: 'bg-warning/10', border: 'border-warning' },
        medium: { text: 'text-info', bg: 'bg-info/10', border: 'border-info' },
        low: { text: 'text-success', bg: 'bg-success/10', border: 'border-success' },
        info: { text: 'text-gray-text', bg: 'bg-gray-text/10', border: 'border-gray-text' },
    };
    const style = severityStyles[details.severity] || severityStyles.info;

    // Handler for the "Isolate Host" button
    const handleIsolateClick = () => {
        if (onIsolate) {
            onIsolate(event); // Call the function passed from the parent
        }
        onClose();       // Close the modal after the action
    };

    return (
        // Modal backdrop
        <div 
            onClick={onClose}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
            {/* Modal content - stopPropagation prevents closing when clicking inside */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className={`bg-card-bg rounded-lg w-full max-w-2xl border ${style.border} shadow-2xl animate-fade-in`}
            >
                {/* Header */}
                <div className={`flex justify-between items-center p-4 border-b ${style.border}`}>
                    <h2 className="text-xl font-bold text-light flex items-center gap-3">
                        <FontAwesomeIcon icon={faExclamationTriangle} className={style.text} />
                        {details.title}
                    </h2>
                    <button onClick={onClose} className="text-gray-text hover:text-light">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                    {/* Left Column: Event Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-light border-b border-border pb-2">Event Information</h3>
                        <dl>
                            <DetailRow label="Severity">
                                <span className={`px-2 py-1 rounded font-medium text-xs ${style.bg} ${style.text}`}>
                                    {details.severity.toUpperCase()}
                                </span>
                            </DetailRow>
                            <DetailRow label="Timestamp" value={details.timestamp} />
                            <DetailRow label="Description" value={details.description} />
                            <DetailRow label="Source" value={details.source} />
                        </dl>
                    </div>

                    {/* Right Column: Network & Actions */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-light border-b border-border pb-2">Network Details</h3>
                        <dl>
                           <DetailRow label="Source IP" value={details.sourceIp} />
                           <DetailRow label="Destination IP" value={details.destIp} />
                        </dl>
                        
                        <h3 className="font-semibold text-light border-b border-border pb-2 mt-4">Response Actions</h3>
                        <div className="flex gap-2">
                           <button 
                                onClick={handleIsolateClick} // <-- ATTACH THE NEW HANDLER
                                className="bg-primary text-white px-4 py-2 text-sm rounded-md hover:bg-primary-dark w-full flex items-center justify-center gap-2"
                           >
                               <FontAwesomeIcon icon={faShieldAlt} />
                               Isolate Host
                           </button>
                           <button onClick={onClose} className="bg-dark-gray text-light px-4 py-2 text-sm rounded-md hover:bg-border w-full">
                               Dismiss
                           </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatDetailModal;