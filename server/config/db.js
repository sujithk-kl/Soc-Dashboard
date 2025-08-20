// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/soc-dashboard';
        const conn = await mongoose.connect(mongoURI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.log('💡 Make sure MongoDB is running on your system');
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;