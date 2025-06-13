# Soc-Dashboard

# Real-Time SOC (Security Operations Center) Dashboard

A full-stack, real-time cybersecurity dashboard designed to help SOC teams monitor, detect, and respond to threats across a network using real-time logs, alerts, and threat intelligence data.

---

## 🚀 Features

- **Real-Time Log Feed** via WebSockets
- **Alerts Dashboard** with severity, status, and SLA breakdowns
- **Threat Map** with geolocation markers
- **Graphical Charts** using Recharts for log trends
- **RBAC (Role-Based Access Control)** with MFA support
- **Threat Intelligence APIs** (VirusTotal, AbuseIPDB, Shodan)
- **Dark Mode** for better visibility
- **Export Logs** to CSV

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                                       |
|-------------|----------------------------------------------------------|
| Frontend    | React.js, Tailwind CSS, Recharts, Leaflet.js             |
| Backend     | Node.js, Express.js, Socket.IO                           |
| Database    | MongoDB                                                  |
| Security Tools | Suricata/Wazuh (HIDS/NIDS), VirusTotal API, AbuseIPDB |
| Real-Time   | WebSockets (Socket.IO)                                   |

---

## 📊 Dashboard Preview

![SOC Dashboard Screenshot](link-to-screenshot-if-hosted)

---

## 📁 Folder Structure

```bash
src/
│
├── components/        # Dashboard Cards, Charts, Map, Table
├── pages/             # Dashboard, Alerts, Reports
├── services/          # API calls, WebSocket handlers
├── utils/             # Helper functions and constants
└── App.jsx            # Main component
