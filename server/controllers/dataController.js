// server/controllers/dataController.js
const Alert = require('../models/alertModel');
const Event = require('../models/eventModel');
const WindowsEventReader = require('../windowsEventReader');
const windowsReader = new WindowsEventReader();

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

// --- WINDOWS SECURITY EVENTS (REAL LOGS) ---
exports.getWindowsSecurityEvents = async (req, res) => {
    try {
        const rawEvents = await windowsReader.readSecurityEvents(25);

        const mapSeverity = (id) => {
            switch (Number(id)) {
                case 4625: return 'high'; // failed logon
                case 4688: return 'medium'; // process created
                case 4624: return 'low'; // successful logon
                default: return 'low';
            }
        };
        const mapIcon = (id) => {
            switch (Number(id)) {
                case 4625: return 'exclamation-triangle';
                case 4688: return 'terminal';
                case 4624: return 'user';
                default: return 'shield-alt';
            }
        };

        const events = (rawEvents || []).map((e, idx) => {
            const ts = e.TimeCreated ? new Date(e.TimeCreated) : new Date();
            const id = `${ts.getTime()}-${e.Id || 'evt'}-${idx}`;
            const message = (e.Message || '').toString().split('\n')[0];
            return {
                id,
                title: `WinSec Event ${e.Id || ''}`.trim(),
                description: message || 'Windows Security event',
                timestamp: ts.toLocaleString(),
                severity: mapSeverity(e.Id),
                icon: mapIcon(e.Id),
                sourceIp: '-',
                destIp: '-',
            };
        });

        res.json(events);
    } catch (error) {
        console.error('Error fetching Windows security events:', error);
        res.status(500).json({ message: 'Error fetching Windows security events' });
    }
};