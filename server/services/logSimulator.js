// server/services/logSimulator.js

const geoip = require('geoip-lite'); // <-- IMPORT THE NEW PACKAGE

// --- CONFIGURATION ---
const titles = ['Unauthorized Access Attempt', 'Port Scanning Activity', 'Malware Detected', 'Suspicious File Transfer', 'Firewall Rule Modification', 'Brute Force Attack', 'Data Exfiltration Alert'];
const severities = ['low', 'medium', 'high', 'critical'];
// Note: You would need to define your icons object for this to work fully.
const icons = {
    low: 'shield-alt',
    medium: 'shield-alt',
    high: 'exclamation-triangle',
    critical: 'skull-crossbones'
};

// --- STATE SIMULATION ---
let totalAlerts = 1248;
let criticalThreats = 42;

// --- GENERATOR FUNCTIONS ---

// NEW: Function to generate a random public IP address
function generateRandomPublicIp() {
    // This generates IPs from various blocks around the world, avoiding private ranges.
    const sections = [
        Math.floor(Math.random() * 18) + 1, // 1-18
        Math.floor(Math.random() * 20) + 20, // 20-39
        Math.floor(Math.random() * 100) + 40, // 40-139
        Math.floor(Math.random() * 100) + 140 // 140-239
    ];
    const ipPart1 = sections[Math.floor(Math.random() * sections.length)];
    return `${ipPart1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

// UPDATED: Now generates public IPs and adds location data
function generateRandomLog() {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const publicIp = generateRandomPublicIp();

    const log = {
        id: Date.now(),
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Automated event simulation from backend.',
        sourceIp: publicIp, // Use the public IP as the source
        destIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date().toLocaleTimeString(),
        severity,
        icon: icons[severity],
    };

    // --- ADD GEOLOCATION DATA for high-severity events ---
    if (severity === 'critical' || severity === 'high') {
        const geo = geoip.lookup(publicIp);
        // Ensure geo and geo.ll (latitude/longitude array) exist
        if (geo && geo.ll) {
            log.location = {
                lat: geo.ll[0],
                lng: geo.ll[1],
                city: geo.city,
                country: geo.country,
            };
        }
    }

    return log;
}

// Generates and increments stat values for real-time updates
function generateRealtimeStats() {
    totalAlerts += Math.floor(Math.random() * 5);
    if (Math.random() > 0.8) {
        criticalThreats++;
    }
    // Simulate trend changes
    const trendChange = (Math.random() * 2).toFixed(1);
    const trendUp = Math.random() > 0.5;

    return [{
        title: 'Total Alerts',
        value: totalAlerts.toLocaleString(),
        trend: `+${trendChange}%`,
        trendUp: true,
        icon: 'bell'
    }, {
        title: 'Critical Threats',
        value: criticalThreats.toLocaleString(),
        trend: `${trendUp ? '+' : '-'}${trendChange / 2}%`,
        trendUp: trendUp,
        icon: 'exclamation-triangle'
    }, {
        title: 'Incidents Resolved',
        value: '96%',
        trend: '+0.1%',
        trendUp: true,
        icon: 'check-circle'
    }, {
        title: 'Avg. Response Time',
        value: '18m 35s',
        trend: '-0.2m',
        trendUp: false,
        icon: 'clock'
    }, ];
}

function generateThreatIntel() {
    const virusTotalScore = 85 + Math.floor(Math.random() * 5);
    const abuseIpdbConfidence = 92 + Math.floor(Math.random() * 5);
    const shodanExposures = 12 + (Math.random() > 0.9 ? 1 : 0);

    return [{
        title: 'VirusTotal Score',
        value: `${virusTotalScore}/100`
    }, {
        title: 'AbuseIPDB Confidence',
        value: `${abuseIpdbConfidence}%`
    }, {
        title: 'Shodan Exposures',
        value: shodanExposures.toString()
    }, ];
}


// --- MAIN SIMULATOR ---
function startLogSimulator(io) {
    // Emit a new log every 5 seconds
    setInterval(() => {
        const newLog = generateRandomLog();
        io.emit('new_log', newLog);
    }, 5000);

    // Emit updated stats every 3 seconds
    setInterval(() => {
        const newStats = generateRealtimeStats();
        io.emit('update_stats', newStats);
    }, 3000);

    // Emit updated threat intel every 7 seconds
    setInterval(() => {
        const newIntel = generateThreatIntel();
        io.emit('update_intel', newIntel);
    }, 7000);
}

module.exports = startLogSimulator;