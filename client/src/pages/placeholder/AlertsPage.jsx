// client/src/pages/placeholder/AlertsPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
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
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [filterSource, setFilterSource] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
    
    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Debounce search term to prevent excessive re-renders
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

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
        // Early return if no alerts
        if (!alerts.length) return [];

        // Use a single pass for all filtering operations
        const filteredAlerts = alerts.filter(alert => {
            // Search filtering
            if (debouncedSearchTerm.trim()) {
                const searchLower = debouncedSearchTerm.toLowerCase();
                const title = (alert.title || '').toLowerCase();
                const description = (alert.description || '').toLowerCase();
                const source = (alert.source || '').toLowerCase();
                const severity = (alert.severity || '').toLowerCase();
                const status = (alert.status || '').toLowerCase();
                
                const matchesSearch = title.includes(searchLower) ||
                                    description.includes(searchLower) ||
                                    source.includes(searchLower) ||
                                    severity.includes(searchLower) ||
                                    status.includes(searchLower);
                
                if (!matchesSearch) return false;
            }

            // Status filtering
            if (filterStatus !== 'all' && alert.status !== filterStatus) {
                return false;
            }

            // Severity filtering
            if (filterSeverity !== 'all' && alert.severity !== filterSeverity) {
                return false;
            }

            // Source filtering
            if (filterSource !== 'all' && alert.source !== filterSource) {
                return false;
            }

            return true;
        });

        // Sorting with optimized comparison
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        
        return filteredAlerts.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Special handling for severity sorting
            if (sortConfig.key === 'severity') {
                aValue = severityOrder[a.severity] || 0;
                bValue = severityOrder[b.severity] || 0;
            }

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (bValue == null) return sortConfig.direction === 'ascending' ? 1 : -1;

            // String comparison for better performance
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const result = aValue.localeCompare(bValue);
                return sortConfig.direction === 'ascending' ? result : -result;
            }

            // Numeric comparison
            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }, [alerts, debouncedSearchTerm, filterStatus, filterSeverity, filterSource, sortConfig]);

    const requestSort = useCallback((key) => {
        setSortConfig(prev => {
            let direction = 'ascending';
            if (prev.key === key && prev.direction === 'ascending') {
                direction = 'descending';
            }
            return { key, direction };
        });
    }, []);
    
    // Modal handlers
    const handleEventClick = useCallback((event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    }, []);
    
    const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
    
    const handleIsolateEvent = useCallback(async (eventToIsolate) => {
        try {
            const result = await isolateHostAction(eventToIsolate, user.role);
            setAlerts(prev => prev.filter(a => a._id !== eventToIsolate._id));
            toast.success(result.message);
        } catch (error) {
            toast.error(error.message);
        } finally {
            handleCloseModal();
        }
    }, [user.role, handleCloseModal]);

    return (
        <>
            <div className="p-2">
                <h1 className="text-3xl font-bold text-light mb-4">Security Alerts</h1>
                
                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-text" />
                        <input
                            type="text"
                            placeholder="Search alerts by title, description, source, severity, or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-dark-gray rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none text-light"
                        />
                    </div>
                    
                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faFilter} className="text-gray-text" />
                            <label htmlFor="status-filter" className="text-gray-text">Status:</label>
                            <select 
                                id="status-filter"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="bg-dark-gray px-3 py-1 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                            >
                                <option value="all">All</option>
                                <option value="open">Open</option>
                                <option value="investigating">Investigating</option>
                                <option value="resolved">Resolved</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <label htmlFor="severity-filter" className="text-gray-text">Severity:</label>
                            <select 
                                id="severity-filter"
                                value={filterSeverity}
                                onChange={(e) => setFilterSeverity(e.target.value)}
                                className="bg-dark-gray px-3 py-1 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                            >
                                <option value="all">All</option>
                                <option value="critical">Critical</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <label htmlFor="source-filter" className="text-gray-text">Source:</label>
                            <select 
                                id="source-filter"
                                value={filterSource}
                                onChange={(e) => setFilterSource(e.target.value)}
                                className="bg-dark-gray px-3 py-1 rounded-md border border-border focus:ring-2 focus:ring-primary focus:outline-none text-sm"
                            >
                                <option value="all">All</option>
                                <option value="Windows Security">Windows Security</option>
                                <option value="Defender">Defender</option>
                                <option value="SmartScreen">SmartScreen</option>
                            </select>
                        </div>
                    </div>
                </div>

                                {/* Alerts Table */}
                <div className="bg-card-bg rounded-lg overflow-hidden border border-border">
                    <table className="w-full">
                        <thead className="bg-dark-gray/30 sticky top-0 z-10">
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
                            ) : processedAlerts.length === 0 ? (
                                <tr><td colSpan="5" className="text-center p-4 text-gray-text">No alerts found</td></tr>
                            ) : (
                                processedAlerts.slice(0, 100).map(alert => (
                                    <tr 
                                        key={alert._id}
                                        onClick={() => handleEventClick(alert)}
                                        className="border-b border-border hover:bg-dark-gray/20 cursor-pointer transition-colors duration-150"
                                    >
                                        <td className="p-3 text-gray-text whitespace-nowrap">
                                            {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs rounded-full font-semibold bg-${alert.severity || 'low'}/10 text-${alert.severity || 'low'}`}>
                                                {(alert.severity || 'low').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="p-3 font-semibold max-w-xs truncate" title={alert.title || 'Untitled Alert'}>
                                            {alert.title || 'Untitled Alert'}
                                        </td>
                                        <td className="p-3 text-gray-text whitespace-nowrap">{alert.source || 'Unknown'}</td>
                                        <td className="p-3 text-gray-text whitespace-nowrap">{alert.status || 'open'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {processedAlerts.length > 100 && (
                        <div className="p-3 text-center text-gray-text text-sm border-t border-border">
                            Showing first 100 alerts of {processedAlerts.length} total
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && <ThreatDetailModal event={selectedEvent} onClose={handleCloseModal} onIsolate={handleIsolateEvent} />}
        </>
    );
};

export default AlertsPage;