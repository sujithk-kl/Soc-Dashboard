// server/routes/api.js

const express = require('express');
const router = express.Router();

// --- DEPENDENCY IMPORTS ---
const dataController = require('../controllers/dataController');
const userController = require('../controllers/userController');
const { requirePermission } = require('../middleware/auth');
const { PERMISSIONS, ROLES } = require('../config/roles');
const Alert = require('../models/alertModel');
const Event = require('../models/eventModel');

// --- AUTHENTICATION ROUTES ---
router.post('/auth/login', userController.login);
router.get('/auth/user-role', userController.getUserRoleByEmail);
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

router.delete('/admin/users/:id', (req, res, next) => {
    const role = req.header('X-User-Role');
    if (role !== ROLES.ADMIN) return res.status(403).json({ message: 'Admin only.' });
    next();
}, userController.deleteUser);

router.put('/admin/users/:id/status', (req, res, next) => {
    const role = req.header('X-User-Role');
    if (role !== ROLES.ADMIN) return res.status(403).json({ message: 'Admin only.' });
    next();
}, userController.toggleUserStatus);

// --- PUBLIC DATA ROUTES (No permissions required) ---
router.get('/stats', dataController.getStats);
router.get('/alerts', dataController.getAlerts); // This gets the recent 5 for the dashboard
router.get('/alerts/all', dataController.getAllAlerts); // <-- NEW ROUTE for the alerts page
router.get('/timeline', dataController.getTimelineEvents);
router.get('/windows/security', dataController.getWindowsSecurityEvents); // NEW: Windows Security events
router.get('/windows/defender', dataController.getWindowsDefenderEvents); // NEW: Defender Operational log
router.get('/windows/smartscreen', dataController.getSmartScreenEvents); // NEW: SmartScreen Operational log

// --- WINDOWS EVENT INGEST (from on-prem collector) ---
router.post('/ingest/windows', async (req, res) => {
  try {
    const shared = process.env.INGEST_SHARED_SECRET || '';
    const provided = req.header('X-Auth') || '';
    if (!shared || provided !== shared) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const events = Array.isArray(req.body) ? req.body : [];
    let saved = 0;
    for (const e of events) {
      const ts = e.TimeCreated ? new Date(e.TimeCreated) : new Date();
      const idNum = Number(e.Id);
      const title = e.LevelDisplayName ? `${e.LevelDisplayName} Event ${idNum||''}`.trim() : `Windows Event ${idNum||''}`;
      const desc = (e.Message || '').toString().split('\n')[0] || 'Windows event';
      const severity = idNum === 4625 ? 'high' : idNum === 4688 ? 'medium' : 'low';
      try {
        await Event.create({ title, description: desc, sourceIp: '-', status: severity, time: ts.toLocaleString() });
        if (severity === 'high' || severity === 'critical') {
          await Alert.create({ title, description: desc, source: 'Ingested Windows', severity, status: 'open' });
        }
        saved++;
      } catch (_) {}
    }
    return res.status(200).json({ saved });
  } catch (err) {
    return res.status(500).json({ message: 'Ingest failed' });
  }
});

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