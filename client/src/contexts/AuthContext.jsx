// client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext } from 'react';

// Define roles and permissions
const ROLES = {
    ADMIN: 'Admin',
    ANALYST: 'Analyst',
    VIEWER: 'Viewer'
};

const PERMISSIONS = {
    PERFORM_RESPONSE_ACTIONS: 'perform_response_actions',
    MANAGE_USERS: 'manage_users'
};

// --- NEW: A list of test users for easy switching ---
const testUsers = [
    { name: 'Alice Admin', initials: 'AA', role: ROLES.ADMIN },
    { name: 'John Doe', initials: 'JD', role: ROLES.ANALYST },
    { name: 'Bob Viewer', initials: 'BV', role: ROLES.VIEWER },
];

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Start with the Analyst user as the default
    const [user, setUser] = useState(testUsers[1]);

    // --- NEW: Function to switch the current user ---
    const switchUser = (newUser) => {
        setUser(newUser);
    };

    // A map of permissions for each role
    const rolePermissions = {
        [ROLES.ADMIN]: [PERMISSIONS.PERFORM_RESPONSE_ACTIONS, PERMISSIONS.MANAGE_USERS],
        [ROLES.ANALYST]: [PERMISSIONS.PERFORM_RESPONSE_ACTIONS],
        [ROLES.VIEWER]: [],
    };
    
    // Helper function to check for permission
    const hasPermission = (permission) => {
        const permissionsForRole = rolePermissions[user.role] || [];
        return permissionsForRole.includes(permission);
    };
    
    // The value provided to consuming components
    const value = {
        user,
        testUsers, // Expose the list of users
        switchUser, // Expose the switch function
        ROLES,
        PERMISSIONS,
        hasPermission,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};