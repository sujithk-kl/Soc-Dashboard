// client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:4000/api';

// Define roles and permissions
export const ROLES = {
    ADMIN: 'Admin',
    ANALYST: 'Analyst',
    VIEWER: 'Viewer'
};

export const PERMISSIONS = {
    PERFORM_RESPONSE_ACTIONS: 'perform_response_actions',
    MANAGE_USERS: 'manage_users'
};

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem('soc_user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            return null;
        }
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!user);

    useEffect(() => {
        if (user) {
            localStorage.setItem('soc_user', JSON.stringify(user));
            setIsAuthenticated(true);
        } else {
            localStorage.removeItem('soc_user');
            setIsAuthenticated(false);
        }
    }, [user]);
    
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (response.data.user) {
                setUser(response.data.user);
                toast.success('Login successful!');
                return true;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed.');
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        toast('You have been logged out.');
    };

    const rolePermissions = {
        [ROLES.ADMIN]: [PERMISSIONS.PERFORM_RESPONSE_ACTIONS, PERMISSIONS.MANAGE_USERS],
        [ROLES.ANALYST]: [PERMISSIONS.PERFORM_RESPONSE_ACTIONS],
        [ROLES.VIEWER]: [],
    };
    
    const hasPermission = (permission) => {
        if (!user) return false;
        const permissionsForRole = rolePermissions[user.role] || [];
        return permissionsForRole.includes(permission);
    };
    
    const value = {
        user,
        isAuthenticated,
        login,
        logout,
        ROLES,
        PERMISSIONS,
        hasPermission,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};