// server/controllers/dataController.js

// This function provides the *initial* state for the stat cards.
// It MUST be exported.
exports.getStats = (req, res) => {
  res.json([
    { title: 'Total Alerts', value: '1,248', trend: '+12.4%', trendUp: true, icon: 'bell' },
    { title: 'Critical Threats', value: '42', trend: '-3.2%', trendUp: false, icon: 'exclamation-triangle' },
    { title: 'Incidents Resolved', value: '96%', trend: '+2.1%', trendUp: true, icon: 'check-circle' },
    { title: 'Avg. Response Time', value: '18m 42s', trend: '-1.8m', trendUp: false, icon: 'clock' },
  ]);
};

// This function provides the *initial* state for the alerts list.
// It MUST be exported.
exports.getAlerts = (req, res) => {
  res.json([
    { id: 1, title: 'Critical Vulnerability Detected', description: 'CVE-2023-12345 found in web server', source: 'Wazuh', timestamp: '10 mins ago', severity: 'critical', status: 'open', sla: '2h' },
    { id: 2, title: 'Suspicious Network Activity', description: 'Unusual traffic patterns detected', source: 'Suricata', timestamp: '25 mins ago', severity: 'high', status: 'investigating', sla: '4h' },
    { id: 3, title: 'Failed Login Attempts', description: '15 failed login attempts from single IP', source: 'Auth Logs', timestamp: '1 hour ago', severity: 'medium', status: 'open', sla: '8h' },
  ]);
};

// This function provides the *initial* state for the threat intel card.
// It MUST be exported.
exports.getThreatIntel = (req, res) => {
  res.json([
    { title: 'VirusTotal Score', value: '87/100' },
    { title: 'AbuseIPDB Confidence', value: '94%' },
    { title: 'Shodan Exposures', value: '12' },
  ]);
};

// This function provides the *initial* state for the timeline.
// It MUST be exported.
exports.getTimelineEvents = (req, res) => {
  res.json([
      { id: 101, time: '14:30', title: 'Ransomware Attack Detected', description: 'Critical server encrypted', status: 'critical' },
      { id: 102, time: '14:15', title: 'Data Exfiltration Alert', description: 'Sensitive data transfer detected', status: 'high' },
      { id: 103, time: '13:45', title: 'Vulnerability Scan Completed', description: '3 critical vulnerabilities found', status: 'critical' },
  ]);
};