// server/createAdminInteractive.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const { ROLES } = require('./config/roles');
const readline = require('readline');

dotenv.config();
connectDB();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdminInteractive = async () => {
    try {
        // Check if admin already exists
        const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
        if (adminCount > 0) {
            console.log('❌ Admin user already exists!');
            rl.close();
            process.exit(1);
        }

        console.log('🔐 Create Admin User\n');

        // Get user input
        const name = await question('Enter full name: ');
        const email = await question('Enter email: ');
        const password = await question('Enter password: ');

        if (!name || !email || !password) {
            console.log('❌ All fields are required!');
            rl.close();
            process.exit(1);
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.log('❌ An account with this email already exists!');
            rl.close();
            process.exit(1);
        }

        // Create admin user
        const adminUser = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: ROLES.ADMIN,
            initials: name.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'
        });

        console.log('\n✅ Admin user created successfully!');
        console.log(`📧 Login with: ${email}`);
        
        rl.close();
        process.exit();
    } catch (error) {
        console.error(`❌ Error creating admin: ${error}`);
        rl.close();
        process.exit(1);
    }
};

createAdminInteractive();
