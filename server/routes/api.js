// server/routes/api.js

const express = require('express');
const router = express.Router();

// --- DEPENDENCY IMPORTS ---
const dataController = require('../controllers/dataController');
const userController = require('../controllers/userController');
const { requirePermission } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/roles');

// --- AUTHENTICATION ROUTES ---
router.post('/auth/login', userController.login);
router.post('/auth/register', userController.register); // Registration route

// --- PUBLIC DATA ROUTES (No permissions required) ---
router.get('/stats', dataController.getStats);
router.get('/alerts', dataController.getAlerts);
router.get('/threat-intel', dataController.getThreatIntel);
router.get('/timeline', dataController.getTimelineEvents);

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
