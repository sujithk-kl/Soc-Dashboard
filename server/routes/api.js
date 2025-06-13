const express = require('express');
const router = express.Router();
const { getStats, getAlerts, getThreatIntel, getTimelineEvents } = require('../controllers/dataController');

router.get('/stats', getStats);
router.get('/alerts', getAlerts);
router.get('/threat-intel', getThreatIntel);
router.get('/timeline', getTimelineEvents);

module.exports = router;