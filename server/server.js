// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const job = require('./config/cron');


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const defaultClientURLs = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://soc-dashboard-tau.vercel.app",
  "https://soc.sujithk.me"
];
const extraOrigins = (process.env.FRONTEND_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const clientURLs = Array.from(new Set([...defaultClientURLs, ...extraOrigins]));

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow tools/curl
    if (clientURLs.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};

const io = new Server(server, { cors: { origin: (origin, cb) => cb(null, true), methods: ["GET", "POST"] } });

app.use(cors(corsOptions));
app.use(express.json({ limit: '1mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'SOC Dashboard Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('✅ Socket.IO: A user connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Socket.IO: User disconnected:', socket.id));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Backend server is running on port ${PORT}`));
