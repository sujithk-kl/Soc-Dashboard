const titles = ['Unauthorized Access Attempt', 'Port Scanning Activity', 'Malware Detected', 'Suspicious File Transfer', 'Firewall Rule Modification', 'Brute Force Attack', 'Data Exfiltration Alert'];
const severities = ['low', 'medium', 'high', 'critical'];
const icons = {
    low: 'shield-alt',
    medium: 'info-circle',
    high: 'exclamation-triangle',
    critical: 'fire'
};

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

function startLogSimulator(io) {
    setInterval(() => {
        const newLog = generateRandomLog();
        io.emit('new_log', newLog); // Emit to all connected clients
    }, 5000); // Generate a new log every 5 seconds
}

module.exports = startLogSimulator;