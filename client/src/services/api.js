// client/src/services/api.js

import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

export const getStats = async () => {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
};

export const getAlerts = async () => {
    const response = await axios.get(`${API_URL}/alerts`);
    return response.data;
};

// Add these new functions
export const getThreatIntel = async () => {
    const response = await axios.get(`${API_URL}/threat-intel`);
    return response.data;
};

export const getTimelineEvents = async () => {
    const response = await axios.get(`${API_URL}/timeline`);
    return response.data;
};