import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ThreatDetailModal = ({ threat, onClose }) => {
    if (!threat) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-card-bg rounded-lg w-full max-w-2xl border border-border">
                <div className="flex justify-between items-center p-4 border-b border-border">
                    <h2 className="text-xl font-bold text-light">Threat Details: {threat.title}</h2>
                    <button onClick={onClose} className="text-gray-text hover:text-light">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-semibold text-light mb-2">Information</h3>
                        <p><span className="text-gray-text">Severity:</span> <span className={`font-bold text-${threat.severity}`}>{threat.severity}</span></p>
                        <p><span className="text-gray-text">Source IP:</span> {threat.sourceIp}</p>
                        <p><span className="text-gray-text">Destination IP:</span> {threat.destIp}</p>
                        <p><span className="text-gray-text">Timestamp:</span> {threat.timestamp}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-light mb-2">Actions</h3>
                        <div className="flex gap-2">
                            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">Isolate Host</button>
                            <button className="bg-dark-gray text-light px-4 py-2 rounded-md hover:bg-border">Dismiss</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatDetailModal;