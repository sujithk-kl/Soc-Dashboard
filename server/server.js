// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const startLogSimulator = require('./services/logSimulator');
const apiRoutes = require('./routes/api');
const job = require('./config/cron');


dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const clientURLs = ["http://localhost:5173", "http://localhost:5174", "https://soc-dashboard-tau.vercel.app","https://soc.sujithk.me"];

const io = new Server(server, { cors: { origin: clientURLs, methods: ["GET", "POST"] } });

app.use(cors({ origin: clientURLs }));
app.use(express.json());

app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('✅ Socket.IO: A user connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Socket.IO: User disconnected:', socket.id));
});

startLogSimulator(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Backend server is running on port ${PORT}`));
