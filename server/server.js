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

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://soc-dashboard-tau.vercel.app",
  "https://soc.sujithk.me"
];

// ✅ Express CORS middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies/tokens if needed
  })
);

app.use(express.json({ limit: '1mb' }));

// ✅ Health check
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'SOC Dashboard Backend Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ✅ API routes
app.use('/api', apiRoutes);

// ✅ Socket.IO with same CORS policy
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- Socket events ---
const sendStatsUpdate = async () => {
  try {
    const dataController = require('./controllers/dataController');
    const stats = await dataController.getStats({}, { json: (data) => data });
    io.emit('update_stats', stats);
  } catch (error) {
    console.error('Error sending stats update:', error);
  }
};

io.on('connection', (socket) => {
  console.log('✅ Socket.IO: User connected:', socket.id);

  sendStatsUpdate();

  socket.on('disconnect', () =>
    console.log('❌ Socket.IO: User disconnected:', socket.id)
  );
});

setInterval(sendStatsUpdate, 30000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () =>
  console.log(`✅ Backend server running on port ${PORT}`)
);
