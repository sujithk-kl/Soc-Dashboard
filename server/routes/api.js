// server/routes/api.js

const express = require('express');
const router = express.Router();

// --- DEPENDENCY IMPORTS ---
// Import controller objects for handling route logic
const dataController = require('../controllers/dataController');
const userController = require('../controllers/userController'); // <-- IMPORT USER CONTROLLER

// Import our custom RBAC middleware and permission constants
const { requirePermission } = require('../middleware/auth');
const { PERMISSIONS } = require('../config/roles');


// --- AUTHENTICATION ROUTES ---
router.post('/auth/login', userController.login); // <-- ADD LOGIN ROUTE


// --- PUBLIC DATA ROUTES (No permissions required) ---
// These routes provide the initial data for the dashboard components.
router.get('/stats', dataController.getStats);
router.get('/alerts', dataController.getAlerts);
router.get('/threat-intel', dataController.getThreatIntel);
router.get('/timeline', dataController.getTimelineEvents);


// --- PROTECTED ACTION ROUTES (Permission required) ---
// This route simulates the "Isolate Host" action.
// The `requirePermission` middleware will run first. If the user has the correct
// permission, it will call `next()` and the main route handler will execute.
// If not, the middleware will send a 403 Forbidden response.
router.post(
    '/actions/isolate', 
    requirePermission(PERMISSIONS.PERFORM_RESPONSE_ACTIONS), 
    (req, res) => {
        const { event } = req.body;
        
        // In a real-world scenario, you would trigger a real action here,
        // for example, by calling a firewall API or an EDR agent.
        console.log(`RBAC SUCCESS: User performed 'Isolate Host' on IP: ${event.sourceIp}`);
        
        res.status(200).json({ message: `Host ${event.sourceIp} has been successfully isolated.` });
    }
);

// Export the router to be used in the main server.js file
module.exports = router;