# SOC Dashboard

A real-time Security Operations Center (SOC) dashboard that monitors Windows security events, provides threat intelligence, and offers comprehensive alert management.

![SOC Dashboard](https://img.shields.io/badge/Status-Active-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)

---

## ✨ Features

- **Real-Time Monitoring**: Windows Security, Defender, and SmartScreen events
- **Advanced Alert Management**: Search, filter, and sort with performance optimization
- **RBAC System**: Admin, Analyst, and Viewer roles with JWT authentication
- **Threat Intelligence**: Real-time threat map and timeline events
- **Encrypted Storage**: Sensitive data protection in MongoDB

---

## 🛠️ Tech Stack

**Frontend**: React 18, Tailwind CSS, FontAwesome, Socket.IO  
**Backend**: Node.js, Express.js, MongoDB, JWT  
**Security**: Windows Event Logs, PowerShell Integration, Data Encryption

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, MongoDB 6+, Windows 10/11, PowerShell

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/soc-dashboard.git
   cd soc-dashboard
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Configure Environment**
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env file with your configuration
   ```

3. **Setup & Run**
   ```bash
   # Create admin user
   cd server && node createAdmin.js
   
   # Start backend (Terminal 1)
   npm run dev
   
   # Start frontend (Terminal 2)
   cd ../client && npm run dev
   ```

4. **Access Dashboard**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:4000
   - Default: `admin@example.com` / `admin123`

---

## 📊 Event Monitoring

| Event ID | Description | Severity |
|----------|-------------|----------|
| 4624 | Successful logon | Low |
| 4625 | Failed logon | High |
| 4688 | Process creation | Medium |
| 1006 | Malware detected | Critical |
| 1150 | Defender healthy | Low |

**Monitored Logs**: Security, Windows Defender, SmartScreen

---

## 🔧 Configuration

### Alert Management
- **Search**: Real-time search across all fields
- **Filters**: Status, severity, source filtering
- **Performance**: Debounced search (300ms), pagination (100 items)
- **Sorting**: Click column headers to sort

### Security Features
- **Authentication**: JWT-based with role-based access
- **Encryption**: Data encrypted at rest in MongoDB
- **CORS**: Configurable origin restrictions
- **Windows Integration**: Secure PowerShell execution

---

## 📁 Project Structure

```
soc-dashboard/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   └── contexts/    # React contexts
├── server/          # Node.js backend
│   ├── controllers/ # Route handlers
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   └── utils/       # Utilities
└── README.md
```

---

## 🚨 Troubleshooting

### Common Issues

**Windows Events Not Loading**
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Get-WinEvent -LogName Security -MaxEvents 1
```

**MongoDB Connection**
```bash
net start MongoDB
# Verify: mongodb://localhost:27017/soc-dashboard
```

**CORS Errors**
```bash
# Update FRONTEND_ORIGINS in .env
FRONTEND_ORIGINS=http://localhost:5173
```

---

## 📊 API Endpoints

**Authentication**: `POST /api/auth/login`, `POST /api/auth/register`  
**Alerts**: `GET /api/alerts`, `GET /api/windows/security`  
**Dashboard**: `GET /api/stats`, `GET /api/timeline`

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for the cybersecurity community**
