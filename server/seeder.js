// server/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Alert = require('./models/alertModel');
const Event = require('./models/eventModel');
const { ROLES } = require('./config/roles');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        console.log('Clearing existing data...');
        await User.deleteMany();
        await Alert.deleteMany();
        await Event.deleteMany();

        console.log('Importing sample users (no default Admin)...');
        await User.insertMany([
            { name: 'John Doe', email: 'analyst@soc.com', password: 'password123', role: ROLES.ANALYST, initials: 'JD' },
            { name: 'Bob Viewer', email: 'viewer@soc.com', password: 'password123', role: ROLES.VIEWER, initials: 'BV' },
        ]);

        console.log('Importing sample alerts...');
        await Alert.insertMany([
            { title: 'Initial Critical Vulnerability', description: 'CVE-2023-9999 found', source: 'Nessus', severity: 'critical', status: 'open' },
            { title: 'Initial Suspicious Activity', description: 'Unusual traffic patterns', source: 'Suricata', severity: 'high', status: 'investigating' },
        ]);
        
        console.log('✅ Data Imported Successfully!');
        console.log('💡 To create an admin user, register as the first user on the website!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data import: ${error}`);
        process.exit(1);
    }
};

importData();