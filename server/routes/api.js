// server/routes/api.js

const express = require('express');
const router = express.Router();

// --- DEPENDENCY IMPORTS ---
const dataController = require('../controllers/dataController');
const userController = require('../controllers/userController');
const { requirePermission } = require('../middleware/auth');
const { PERMISSIONS, ROLES } = require('../config/roles');

// --- AUTHENTICATION ROUTES ---
router.post('/auth/login', userController.login);
router.post('/auth/register', userController.register); // Registration route (bootstrap + admin-only afterwards)

// Bootstrap status: whether any Admin exists
router.get('/auth/bootstrap-status', async (req, res) => {
  const User = require('../models/userModel');
  const { ROLES } = require('../config/roles');
  const count = await User.countDocuments({ role: ROLES.ADMIN });
  res.status(200).json({ hasAdmin: count > 0 });
});

// --- ADMIN MANAGEMENT ROUTES ---
router.get('/admin/users', (req, res, next) => {
    const role = req.header('X-User-Role');
    if (role !== ROLES.ADMIN) return res.status(403).json({ message: 'Admin only.' });
    next();
}, userController.listUsers);

router.put('/admin/users/:id/password', (req, res, next) => {
    const role = req.header('X-User-Role');
    if (role !== ROLES.ADMIN) return res.status(403).json({ message: 'Admin only.' });
    next();
}, userController.updatePassword);

// --- PUBLIC DATA ROUTES (No permissions required) ---
router.get('/stats', dataController.getStats);
router.get('/alerts', dataController.getAlerts); // This gets the recent 5 for the dashboard
router.get('/alerts/all', dataController.getAllAlerts); // <-- NEW ROUTE for the alerts page
router.get('/timeline', dataController.getTimelineEvents);
router.get('/windows/security', dataController.getWindowsSecurityEvents); // NEW: Windows Security events

// --- PROTECTED ACTION ROUTES (Permission required) ---
router.post(
    '/actions/isolate',
    requirePermission(PERMISSIONS.PERFORM_RESPONSE_ACTIONS),
    (req, res) => {
        const { event } = req.body;
        console.log(`RBAC SUCCESS: User performed 'Isolate Host' on IP: ${event.sourceIp}`);
        res.status(200).json({ message: `Host ${event.sourceIp} has been successfully isolated.` });
    }
);

// Export the router to be used in the main server.js file
module.exports = router;