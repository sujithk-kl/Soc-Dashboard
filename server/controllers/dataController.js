// server/controllers/dataController.js
const Alert = require('../models/alertModel');
const Event = require('../models/eventModel');

exports.getStats = async (req, res) => {
    try {
        const totalAlerts = await Alert.countDocuments();
        const criticalThreats = await Alert.countDocuments({ severity: 'critical' });
        res.json([
            { title: 'Total Alerts', value: totalAlerts, trend: '+0.5%', trendUp: true, icon: 'bell' },
            { title: 'Critical Threats', value: criticalThreats, trend: '+1.2%', trendUp: true, icon: 'exclamation-triangle' },
            { title: 'Incidents Resolved', value: '96%', trend: '+0%', trendUp: false, icon: 'check-circle' },
            { title: 'Avg. Response Time', value: '17m 5s', trend: '-0.2m', trendUp: false, icon: 'clock' },
        ]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({}).sort({ createdAt: -1 }).limit(5);
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts' });
    }
};

exports.getTimelineEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 }).limit(10);
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching timeline events' });
    }
};

// --- NEW FUNCTION TO GET ALL ALERTS ---
exports.getAllAlerts = async (req, res) => {
    try {
        // Find all alerts and sort them with the newest ones first
        const alerts = await Alert.find({}).sort({ createdAt: -1 });
        res.json(alerts);
    } catch (error) {
        console.error("Error fetching all alerts:", error);
        res.status(500).json({ message: 'Error fetching all alerts' });
    }
};