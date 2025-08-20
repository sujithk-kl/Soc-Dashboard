// server/testConnection.js
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

const testConnection = async () => {
    try {
        console.log('🔌 Testing MongoDB connection...');
        
        // Connect to your database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected successfully!');

        // Test basic Express server
        console.log('🚀 Testing Express server...');
        const app = express();
        app.use(cors());
        app.use(express.json());

        app.get('/test', (req, res) => {
            res.json({ message: 'Server is working!' });
        });

        const PORT = 4000;
        const server = app.listen(PORT, () => {
            console.log(`✅ Express server running on port ${PORT}`);
            console.log('🎉 Everything is working! You can now start your main server.');
            server.close();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testConnection();
