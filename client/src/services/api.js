// client/src/services/api.js

import axios from 'axios';
const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api`;

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

// --- NEW FUNCTION TO GET ALL ALERTS ---
export const getAllAlerts = () => fetchData('alerts/all');

// --- ADMIN USER MANAGEMENT ---
export const listUsers = async (adminRole) => {
    const res = await axios.get(`${API_URL}/admin/users`, {
        headers: { 'X-User-Role': adminRole }
    });
    return res.data;
};

// --- BOOTSTRAP STATUS ---
export const getBootstrapStatus = async () => {
    const res = await axios.get(`${API_URL}/auth/bootstrap-status`);
    return res.data; // { hasAdmin: boolean }
};

export const updateUserPassword = async (userId, newPassword, adminRole) => {
    const res = await axios.put(`${API_URL}/admin/users/${userId}/password`, { newPassword }, {
        headers: { 'X-User-Role': adminRole }
    });
    return res.data;
};

export const adminCreateUser = async (payload, adminRole) => {
    const res = await axios.post(`${API_URL}/auth/register`, payload, {
        headers: { 'X-User-Role': adminRole }
    });
    return res.data;
};