// server/services/logSimulator.js

const geoip = require('geoip-lite');
const Event = require('../models/eventModel');
const Alert = require('../models/alertModel');

// --- CONFIGURATION ---
const titles = ['Unauthorized Access Attempt', 'Port Scanning Activity', 'Malware Detected', 'Suspicious File Transfer', 'Firewall Rule Modification', 'Brute Force Attack', 'Data Exfiltration Alert'];
const severities = ['low', 'medium', 'high', 'critical'];
const icons = {
    low: 'shield-alt',
    medium: 'info-circle',
    high: 'exclamation-triangle',
    critical: 'fire'
};

// --- THIS IS THE MISSING FUNCTION THAT WAS CAUSING THE CRASH ---
function generateRandomLog() {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    // Generate a realistic public IP for better geolocation
    const ipPart1 = Math.floor(Math.random() * 223) + 1; // Avoid special ranges
    const publicIp = `${ipPart1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
    
    // Create the base log object
    const log = {
        id: Date.now(),
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Automated event simulation from backend.',
        sourceIp: publicIp,
        destIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date().toLocaleTimeString(),
        severity,
        icon: icons[severity],
    };

    // Add geolocation data for some events
    const geo = geoip.lookup(publicIp);
    if (geo && geo.ll) {
        log.location = {
            lat: geo.ll[0],
            lng: geo.ll[1],
            city: geo.city || 'Unknown',
            country: geo.country || 'Unknown',
        };
    }
    
    // Return the complete log object
    return log;
}


// This function now generates a log and saves it to the DB if it's important
async function generateAndProcessLog() {
    // This call will now work correctly because generateRandomLog() exists
    const log = generateRandomLog();

    // Now it's safe to check log.severity
    if (log.severity === 'critical' || log.severity === 'high') {
        try {
            await Event.create({
                title: log.title,
                description: `Source: ${log.sourceIp}`,
                sourceIp: log.sourceIp,
                status: log.severity,
                time: log.timestamp,
            });
            await Alert.create({
                title: log.title,
                description: log.description,
                source: "Real-time IDS",
                severity: log.severity,
                status: 'open',
            });
            console.log(`✅ Saved new ${log.severity} event to DB!`);
        } catch (error) {
            console.error("❌ Error saving event to DB:", error);
        }
    }
    return log;
}

// Cosmetic update function for stats
function getCosmeticStats() {
    return [ /* This can be expanded later */ ];
}

// Cosmetic update function for intel
function getCosmeticIntel() {
    return [ /* This can be expanded later */ ];
}


// --- MAIN SIMULATOR ---
function startLogSimulator(io) {
    // Generates, saves, and emits a new log every 5 seconds
    setInterval(async () => {
        const newLog = await generateAndProcessLog();
        io.emit('new_log', newLog);
    }, 5000);

    // Sends cosmetic updates for stats every 3 seconds
    setInterval(() => {
        io.emit('update_stats', getCosmeticStats());
    }, 3000);

    // Sends cosmetic updates for intel every 7 seconds
    setInterval(() => {
        io.emit('update_intel', getCosmeticIntel());
    }, 7000);
}

module.exports = startLogSimulator;