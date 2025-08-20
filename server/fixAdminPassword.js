// server/fixAdminPassword.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const fixAdminPassword = async () => {
    try {
        // Connect to your database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database');

        // Get User model
        const User = require('./models/userModel');

        // Delete the existing admin user
        await User.deleteOne({ email: 'sujithkumaravel03@gmail.com' });
        console.log('🗑️  Deleted existing admin user');

        // Create new admin user with correct password
        const newAdmin = await User.create({
            name: 'sujith',
            email: 'sujithkumaravel03@gmail.com',
            password: 'sujith@3003', // This will be automatically hashed
            role: 'Admin',
            initials: 'S'
        });

        console.log('✅ New admin user created successfully!');
        console.log('📧 Email:', newAdmin.email);
        console.log('🔐 Password: sujith@3003 (now properly hashed)');
        
        // Test the password
        const isMatch = await newAdmin.comparePassword('sujith@3003');
        console.log('🧪 Password test result:', isMatch ? '✅ SUCCESS' : '❌ FAILED');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Fix failed: ${error.message}`);
        process.exit(1);
    }
};

fixAdminPassword();
