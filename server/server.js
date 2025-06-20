// server/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const startLogSimulator = require('./services/logSimulator');
const apiRoutes = require('./routes/api');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const clientURL = 'http://localhost:5173';

const io = new Server(server, { cors: { origin: clientURL, methods: ["GET", "POST"] } });

app.use(cors({ origin: clientURL }));
app.use(express.json());

app.use('/api', apiRoutes);

io.on('connection', (socket) => {
  console.log('✅ Socket.IO: A user connected:', socket.id);
  socket.on('disconnect', () => console.log('❌ Socket.IO: User disconnected:', socket.id));
});

startLogSimulator(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`✅ Backend server is running on port ${PORT}`));