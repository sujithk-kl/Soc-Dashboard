// server/testLogin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const testLogin = async () => {
    try {
        // Connect to your database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database');

        // Get User model
        const User = require('./models/userModel');

        // Test login logic
        const email = 'sujithkumaravel03@gmail.com';
        const password = 'sujith@3003';

        console.log('\n🧪 Testing login logic:');
        console.log('Email:', email);
        console.log('Password:', password);

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('❌ User not found');
            return;
        }

        console.log('✅ User found:', user.name);

        // Test password comparison
        const isPasswordValid = await user.comparePassword(password);
        console.log('Password valid:', isPasswordValid ? '✅ YES' : '❌ NO');

        if (isPasswordValid) {
            console.log('🎉 Login would succeed!');
            const { password: _, ...userToSend } = user.toObject();
            console.log('User data to send:', userToSend);
        } else {
            console.log('❌ Login would fail!');
        }

        process.exit(0);
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        process.exit(1);
    }
};

testLogin();
