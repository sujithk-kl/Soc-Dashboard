const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const startLogSimulator = require('./services/logSimulator');
const apiRoutes = require('./routes/api');

const app = express();
const server = http.createServer(app);

// Configure CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your React app's origin
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the log simulator and pass the io instance
startLogSimulator(io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));