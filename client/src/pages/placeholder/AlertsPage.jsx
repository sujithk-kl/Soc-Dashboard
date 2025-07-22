// client/src/pages/placeholder/AlertsPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { getAllAlerts } from '../../services/api';
import ThreatDetailModal from '../../components/ui/ThreatDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { isolateHostAction } from '../../services/api';
import toast from 'react-hot-toast';

// Helper component for the table header to show sort icons
const SortableHeader = ({ children, name, sortConfig, requestSort }) => {
    const getIcon = () => {
        if (sortConfig.key !== name) return faSort;
        return sortConfig.direction === 'ascending' ? faSortUp : faSortDown;
    };
    return (
        <th onClick={() => requestSort(name)} className="p-3 text-left cursor-pointer hover:bg-dark-gray/50 transition-colors">
            {children} <FontAwesomeIcon icon={getIcon()} className="ml-2 text-gray-400" />
        </th>
    );
};

const AlertsPage = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Fetch all alerts when the component mounts
    useEffect(() => {
        const fetchAlerts = async () => {
            setIsLoading(true);
            try {
                const data = await getAllAlerts();
                setAlerts(data);
            } catch (error) {
                toast.error("Could not fetch alerts.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    // Memoized sorting and filtering logic for performance
    const processedAlerts = useMemo(() => {
        let sortableAlerts = [...alerts];

        // Filtering
        if (filterStatus !== 'all') {
            sortableAlerts = sortableAlerts.filter(alert => alert.status === filterStatus);
        }

        // Sorting
        sortableAlerts.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Special handling for severity sorting
            if (sortConfig.key === 'severity') {
                const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                aValue = severityOrder[a.severity] || 0;
                bValue = severityOrder[b.severity] || 0;
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableAlerts;
    }, [alerts, filterStatus, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    // Modal handlers
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => setIsModalOpen(false);
    const handleIsolateEvent = async (eventToIsolate) => {
        // ... (isolate logic from Dashboard.jsx, adapted for this page)
        try {
            const result = await isolateHostAction(eventToIsolate, user.role);
            setAlerts(prev => prev.filter(a => a._id !== eventToIsolate._id)); // Use _id from MongoDB
            toast.success(result.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            handleCloseModal();
        }
    };

    return (
        <>
            <div className="p-2">
                <h1 className="text-3xl font-bold text-light mb-4">Security Alerts</h1>
                
                {/* Filter Controls */}
                <div className="mb-4">
                    <label htmlFor="status-filter" className="text-gray-text mr-2">Filter by status:</label>
                    <select 
                        id="status-filter"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-dark-gray p-2 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none"
                    >
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                    </select>
                </div>

                {/* Alerts Table */}
                <div className="bg-card-bg rounded-lg overflow-hidden border border-border">
                    <table className="w-full">
                        <thead className="bg-dark-gray/30">
                            <tr>
                                <SortableHeader name="createdAt" sortConfig={sortConfig} requestSort={requestSort}>Timestamp</SortableHeader>
                                <SortableHeader name="severity" sortConfig={sortConfig} requestSort={requestSort}>Severity</SortableHeader>
                                <th className="p-3 text-left">Title</th>
                                <th className="p-3 text-left">Source</th>
                                <SortableHeader name="status" sortConfig={sortConfig} requestSort={requestSort}>Status</SortableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan="5" className="text-center p-4 text-gray-text">Loading alerts...</td></tr>
                            ) : (
                                processedAlerts.map(alert => (
                                    <tr 
                                        key={alert._id} // Use the unique _id from MongoDB
                                        onClick={() => handleEventClick(alert)}
                                        className="border-b border-border hover:bg-dark-gray/20 cursor-pointer"
                                    >
                                        <td className="p-3 text-gray-text">{new Date(alert.createdAt).toLocaleString()}</td>
                                        <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full font-semibold bg-${alert.severity}/10 text-${alert.severity}`}>{alert.severity.toUpperCase()}</span></td>
                                        <td className="p-3 font-semibold">{alert.title}</td>
                                        <td className="p-3 text-gray-text">{alert.source}</td>
                                        <td className="p-3 text-gray-text">{alert.status}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <ThreatDetailModal event={selectedEvent} onClose={handleCloseModal} onIsolate={handleIsolateEvent} />}
        </>
    );
};

export default AlertsPage;