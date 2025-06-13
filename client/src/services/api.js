// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

const fetchData = async (endpoint) => {
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
        // Return an empty array or a default value to prevent crashes
        return []; 
    }
};

export const getStats = () => fetchData('stats');
export const getAlerts = () => fetchData('alerts');
export const getThreatIntel = () => fetchData('threat-intel');
export const getTimelineEvents = () => fetchData('timeline');