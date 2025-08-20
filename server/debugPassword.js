// server/debugPassword.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const debugPassword = async () => {
    try {
        // Connect to your database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database');

        // Get User model
        const User = require('./models/userModel');

        // Find the admin user
        const user = await User.findOne({ email: 'sujithkumaravel03@gmail.com' });
        
        if (!user) {
            console.log('❌ User not found');
            process.exit(1);
        }

        console.log('\n🔍 Password Debug Info:');
        console.log('Email:', user.email);
        console.log('Password length:', user.password.length);
        console.log('Password starts with $2b$:', user.password.startsWith('$2b$'));
        console.log('Password preview:', user.password.substring(0, 20) + '...');

        // Test bcrypt comparison
        const testPassword = 'sujith@3003';
        console.log('\n🧪 Testing bcrypt comparison:');
        console.log('Test password:', testPassword);
        
        try {
            const isMatch = await bcrypt.compare(testPassword, user.password);
            console.log('bcrypt.compare result:', isMatch);
            
            if (isMatch) {
                console.log('✅ Password comparison successful!');
            } else {
                console.log('❌ Password comparison failed!');
            }
        } catch (bcryptError) {
            console.error('❌ bcrypt error:', bcryptError.message);
        }

        // Test the user's comparePassword method
        console.log('\n🧪 Testing user.comparePassword method:');
        try {
            const methodResult = await user.comparePassword(testPassword);
            console.log('user.comparePassword result:', methodResult);
        } catch (methodError) {
            console.error('❌ Method error:', methodError.message);
        }

        process.exit(0);
    } catch (error) {
        console.error(`❌ Debug failed: ${error.message}`);
        process.exit(1);
    }
};

debugPassword();
