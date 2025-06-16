// client/src/services/api.js

import axios from 'axios';
const API_URL = 'http://localhost:4000/api';

const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
        return []; 
    }
};

export const getStats = () => fetchData('stats');
export const getAlerts = () => fetchData('alerts');
export const getThreatIntel = () => fetchData('threat-intel');
export const getTimelineEvents = () => fetchData('timeline');

// --- THIS FUNCTION IS CALLED BY THE ISOLATE HANDLER ---
export const isolateHostAction = async (event, userRole) => {
    try {
        const response = await axios.post(`${API_URL}/actions/isolate`, 
            { event },
            { headers: { 'X-User-Role': userRole } }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Isolate action failed");
    }
};