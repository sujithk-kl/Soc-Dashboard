// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// --- GENERIC GETTER FOR INITIAL DATA ---
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

// --- NEW FUNCTION FOR POSTING AN ACTION ---
export const isolateHostAction = async (event, userRole) => {
    try {
        const response = await axios.post(`${API_URL}/actions/isolate`, 
            { event }, // request body
            { 
                headers: { // request headers
                    'X-User-Role': userRole 
                }
            }
        );
        return response.data;
    } catch (error) {
        // Log the detailed error from the server and re-throw it for the calling component
        console.error("Isolate action failed:", error.response?.data?.message || error.message);
        throw error.response?.data || new Error("Isolate action failed");
    }
};