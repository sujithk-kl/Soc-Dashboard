// server/middleware/auth.js

const { ROLES, rolePermissions } = require('../config/roles');

// In a real app, you'd decode a JWT here to get the user's role.
// For now, we'll simulate it by getting the role from a request header.
const getRoleFromRequest = (req) => {
    const role = req.header('X-User-Role');
    // Default to 'Viewer' if no role is provided
    return Object.values(ROLES).includes(role) ? role : ROLES.VIEWER;
};

// Middleware factory to check for a specific permission
const requirePermission = (permission) => {
    return (req, res, next) => {
        const userRole = getRoleFromRequest(req);
        const userPermissions = rolePermissions.get(userRole);

        if (userPermissions && userPermissions.includes(permission)) {
            // User has the required permission, proceed to the next middleware/handler
            next();
        } else {
            // User does not have permission
            res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }
    };
};

module.exports = { requirePermission };