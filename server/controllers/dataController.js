// server/controllers/dataController.js
const Alert = require('../models/alertModel');
const Event = require('../models/eventModel');
const WindowsEventReader = require('../windowsEventReader');
const windowsReader = new WindowsEventReader();

exports.getStats = async (req, res) => {
    try {
        // Pull recent Windows events
        const [sec, def, ss] = await Promise.all([
            windowsReader.readSecurityEvents(200),
            windowsReader.readFromLog('Microsoft-Windows-Windows Defender/Operational', 100),
            windowsReader.readFromLog('Microsoft-Windows-SmartScreen/Operational', 100)
        ]);

        // Some systems use alternate SmartScreen channel
        let smartscreen = ss;
        if (!smartscreen || smartscreen.length === 0) {
            smartscreen = await windowsReader.readFromLog('Windows Defender SmartScreen/Operational', 100);
        }

        const securityEvents = Array.isArray(sec) ? sec : [];
        const defenderEvents = Array.isArray(def) ? def : [];
        const smartScreenEvents = Array.isArray(smartscreen) ? smartscreen : [];

        // Total Alerts: combine all three
        const totalAlerts = securityEvents.length + defenderEvents.length + smartScreenEvents.length;

        // Critical Threats: failed logons (4625) + all Defender/SmartScreen events
        const failedLogons = securityEvents.filter(e => Number(e.Id) === 4625).length;
        const criticalThreats = failedLogons + defenderEvents.length + smartScreenEvents.length;

        // Incidents Resolved: percent of successful logons among logon events
        const successfulLogons = securityEvents.filter(e => Number(e.Id) === 4624).length;
        const logonTotal = successfulLogons + failedLogons;
        const incidentsResolvedPct = logonTotal > 0 ? Math.round((successfulLogons / logonTotal) * 100) : 100;

        // Avg. Response Time: average time between a failed logon (4625) and the next success (4624)
        const parseTs = (e) => (e && e.TimeCreated ? new Date(e.TimeCreated).getTime() : null);
        const secSorted = securityEvents
            .map(e => ({ id: Number(e.Id), t: parseTs(e) }))
            .filter(e => e.t !== null)
            .sort((a, b) => a.t - b.t);
        let deltas = [];
        for (let i = 0; i < secSorted.length; i++) {
            if (secSorted[i].id === 4625) {
                // find next success after this index
                for (let j = i + 1; j < secSorted.length; j++) {
                    if (secSorted[j].id === 4624) {
                        deltas.push(secSorted[j].t - secSorted[i].t);
                        break;
                    }
                }
            }
        }
        const avgMs = deltas.length > 0 ? Math.round(deltas.reduce((a, b) => a + b, 0) / deltas.length) : null;
        const minutes = avgMs !== null ? Math.floor(avgMs / 60000) : null;
        const seconds = avgMs !== null ? Math.floor((avgMs % 60000) / 1000) : null;
        const avgResponse = avgMs !== null ? `${minutes}m ${seconds}s` : 'N/A';

        res.json([
            { title: 'Total Alerts', value: totalAlerts, trend: '+0.0%', trendUp: true, icon: 'bell' },
            { title: 'Critical Threats', value: criticalThreats, trend: '+0.0%', trendUp: true, icon: 'exclamation-triangle' },
            { title: 'Incidents Resolved', value: `${incidentsResolvedPct}%`, trend: '+0%', trendUp: true, icon: 'check-circle' },
            { title: 'Avg. Response Time', value: avgResponse, trend: '±0m', trendUp: false, icon: 'clock' },
        ]);
    } catch (error) {
        console.error('Error computing stats from Windows logs:', error);
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

        // Persist all events to DB and create alerts for all severity levels
        for (const ev of events) {
            try {
                await Event.create({
                    title: ev.title,
                    description: ev.description,
                    sourceIp: ev.sourceIp,
                    status: ev.severity,
                    time: ev.timestamp,
                });
                await Alert.create({
                    title: ev.title,
                    description: ev.description,
                    source: 'Windows Security',
                    severity: ev.severity,
                    status: 'open',
                });
            } catch (_) { /* ignore duplicates/errors */ }
        }

        res.json(events);
    } catch (error) {
        console.error('Error fetching Windows security events:', error);
        res.status(500).json({ message: 'Error fetching Windows security events' });
    }
};

// --- WINDOWS DEFENDER EVENTS ---
exports.getWindowsDefenderEvents = async (req, res) => {
    try {
        const raw = await windowsReader.readFromLog('Microsoft-Windows-Windows Defender/Operational', 25);
        
        // Map Defender event IDs to severity levels
        const mapDefenderSeverity = (id) => {
            const eventId = Number(id);
            switch (eventId) {
                case 1006: return 'critical'; // Malware detected
                case 1007: return 'critical'; // Malware action taken
                case 1008: return 'high';     // Malware action failed
                case 1009: return 'high';     // Malware action taken
                case 1010: return 'medium';   // Malware quarantined
                case 1011: return 'medium';   // Malware removed
                case 1012: return 'low';      // Malware allowed
                case 1116: return 'high';     // Malware detected
                case 1117: return 'medium';   // Malware quarantined
                case 1118: return 'low';      // Malware allowed
                case 1150: return 'low';      // Endpoint Protection healthy
                case 1151: return 'low';      // Endpoint Protection status
                case 5007: return 'medium';   // Configuration change
                default: return 'medium';     // Default for unknown events
            }
        };

        const events = (raw || []).map((e, idx) => {
            const ts = e.TimeCreated ? new Date(e.TimeCreated) : new Date();
            return {
                id: `${ts.getTime()}-def-${idx}`,
                title: `Defender Event ${e.Id || ''}`.trim(),
                description: (e.Message || '').toString().split('\n')[0] || 'Defender event',
                timestamp: ts.toLocaleString(),
                severity: mapDefenderSeverity(e.Id),
                icon: 'shield-alt',
                sourceIp: '-',
                destIp: '-',
            };
        });
        
        // Persist all Defender events as alerts
        for (const ev of events) {
            try {
                await Event.create({ title: ev.title, description: ev.description, sourceIp: '-', status: ev.severity, time: ev.timestamp });
                await Alert.create({ title: ev.title, description: ev.description, source: 'Defender', severity: ev.severity, status: 'open' });
            } catch (_) {}
        }
        res.json(events);
    } catch (error) {
        console.error('Error fetching Defender events:', error);
        res.status(500).json({ message: 'Error fetching Defender events' });
    }
};

// --- SMARTSCREEN EVENTS ---
exports.getSmartScreenEvents = async (req, res) => {
    try {
        const raw = await windowsReader.readFromLog('Microsoft-Windows-SmartScreen/Operational', 25);
        if (!raw || raw.length === 0) {
            // Some systems log SmartScreen under Windows Defender SmartScreen
            const alt = await windowsReader.readFromLog('Windows Defender SmartScreen/Operational', 25);
            if (!alt || alt.length === 0) return res.json([]);
            const mappedAlt = alt.map((e, idx) => {
                const ts = e.TimeCreated ? new Date(e.TimeCreated) : new Date();
                return {
                    id: `${ts.getTime()}-ss-alt-${idx}`,
                    title: `SmartScreen Event ${e.Id || ''}`.trim(),
                    description: (e.Message || '').toString().split('\n')[0] || 'SmartScreen event',
                    timestamp: ts.toLocaleString(),
                    severity: 'high',
                    icon: 'exclamation-triangle',
                    sourceIp: '-',
                    destIp: '-',
                };
            });
            for (const ev of mappedAlt) {
                try {
                    await Event.create({ title: ev.title, description: ev.description, sourceIp: '-', status: 'high', time: ev.timestamp });
                    await Alert.create({ title: ev.title, description: ev.description, source: 'SmartScreen', severity: 'high', status: 'open' });
                } catch (_) {}
            }
            return res.json(mappedAlt);
        }
        const events = (raw || []).map((e, idx) => {
            const ts = e.TimeCreated ? new Date(e.TimeCreated) : new Date();
            return {
                id: `${ts.getTime()}-ss-${idx}`,
                title: `SmartScreen Event ${e.Id || ''}`.trim(),
                description: (e.Message || '').toString().split('\n')[0] || 'SmartScreen event',
                timestamp: ts.toLocaleString(),
                severity: 'high',
                icon: 'exclamation-triangle',
                sourceIp: '-',
                destIp: '-',
            };
        });
        for (const ev of events) {
            try {
                await Event.create({ title: ev.title, description: ev.description, sourceIp: '-', status: 'high', time: ev.timestamp });
                await Alert.create({ title: ev.title, description: ev.description, source: 'SmartScreen', severity: 'high', status: 'open' });
            } catch (_) {}
        }
        res.json(events);
    } catch (error) {
        console.error('Error fetching SmartScreen events:', error);
        res.status(500).json({ message: 'Error fetching SmartScreen events' });
    }
};