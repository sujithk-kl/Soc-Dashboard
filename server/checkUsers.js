// server/checkUsers.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const { ROLES } = require('./config/roles');

dotenv.config();

const checkUsers = async () => {
    try {
        // Connect to your specific database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to your database');

        const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
        const totalUsers = await User.countDocuments();
        const users = await User.find({}, { name: 1, email: 1, role: 1, _id: 1 });

        console.log('\n📊 Database Status:');
        console.log('Total users:', totalUsers);
        console.log('Admin users:', adminCount);
        
        if (users.length > 0) {
            console.log('\n👥 All users:');
            users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
            });
        } else {
            console.log('\n📝 No users found in database');
        }

        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

checkUsers();
