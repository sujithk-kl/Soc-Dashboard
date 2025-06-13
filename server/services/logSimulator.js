// server/services/logSimulator.js

// --- CONFIGURATION ---
const titles = ['Unauthorized Access Attempt', 'Port Scanning Activity', 'Malware Detected', 'Suspicious File Transfer', 'Firewall Rule Modification', 'Brute Force Attack', 'Data Exfiltration Alert'];
const severities = ['low', 'medium', 'high', 'critical'];
const icons = {
    low: 'shield-alt',
    medium: 'info-circle',
    high: 'exclamation-triangle',
    critical: 'fire'
};

// --- STATE SIMULATION ---
let totalAlerts = 1248;
let criticalThreats = 42;

// --- GENERATOR FUNCTIONS ---

// Generates a new random log event
function generateRandomLog() {
    const severity = severities[Math.floor(Math.random() * severities.length)];
    return {
        id: Date.now(),
        title: titles[Math.floor(Math.random() * titles.length)],
        description: 'Automated event simulation from backend.',
        sourceIp: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destIp: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: new Date().toLocaleTimeString(),
        severity,
        icon: icons[severity],
    };
}

// Generates updated stats
function generateRealtimeStats() {
    totalAlerts += Math.floor(Math.random() * 5);
    if (Math.random() > 0.8) {
        criticalThreats++;
    }
    return [
        { title: 'Total Alerts', value: totalAlerts.toLocaleString(), trend: '+0.2%', trendUp: true, icon: 'bell' },
        { title: 'Critical Threats', value: criticalThreats.toLocaleString(), trend: '+1.1%', trendUp: true, icon: 'exclamation-triangle' },
        { title: 'Incidents Resolved', value: '96%', trend: '+0.0%', trendUp: true, icon: 'check-circle' },
        { title: 'Avg. Response Time', value: '18m 35s', trend: '-0.1m', trendUp: false, icon: 'clock' },
    ];
}

// Generates updated threat intelligence data
function generateThreatIntel() {
    const virusTotalScore = 85 + Math.floor(Math.random() * 5);
    const abuseIpdbConfidence = 92 + Math.floor(Math.random() * 5);
    const shodanExposures = 12 + (Math.random() > 0.9 ? 1 : 0);

    return [
        { title: 'VirusTotal Score', value: `${virusTotalScore}/100` },
        { title: 'AbuseIPDB Confidence', value: `${abuseIpdbConfidence}%` },
        { title: 'Shodan Exposures', value: shodanExposures.toString() },
    ];
}


// --- MAIN SIMULATOR ---
// This function starts all the real-time emitters
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
        console.log('Emitting "update_intel":', newIntel); // For debugging on the server
        io.emit('update_intel', newIntel);
    }, 7000);
}

module.exports = startLogSimulator;