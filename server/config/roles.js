// server/config/roles.js

const ROLES = {
    ADMIN: 'Admin',
    ANALYST: 'Analyst',
    VIEWER: 'Viewer'
};

const PERMISSIONS = {
    // Defines what actions are possible
    VIEW_DASHBOARD: 'view_dashboard',
    PERFORM_RESPONSE_ACTIONS: 'perform_response_actions', // e.g., Isolate Host
    MANAGE_USERS: 'manage_users'
};

// Maps roles to their allowed permissions
const rolePermissions = new Map();
rolePermissions.set(ROLES.ADMIN, [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.PERFORM_RESPONSE_ACTIONS, PERMISSIONS.MANAGE_USERS]);
rolePermissions.set(ROLES.ANALYST, [PERMISSIONS.VIEW_DASHBOARD, PERMISSIONS.PERFORM_RESPONSE_ACTIONS]);
rolePermissions.set(ROLES.VIEWER, [PERMISSIONS.VIEW_DASHBOARD]);

module.exports = {
    ROLES,
    PERMISSIONS,
    rolePermissions
};