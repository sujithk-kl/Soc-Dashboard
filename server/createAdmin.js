// server/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const { ROLES } = require('./config/roles');

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        // Check if admin already exists
        const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
        if (adminCount > 0) {
            console.log('❌ Admin user already exists!');
            process.exit(1);
        }

        // Create admin user
        const adminUser = await User.create({
            name: 'System Administrator',
            email: 'admin@company.com',
            password: 'AdminPass2024!',
            role: ROLES.ADMIN,
            initials: 'SA'
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Login credentials:');
        console.log('   Email: admin@company.com');
        console.log('   Password: AdminPass2024!');
        console.log('⚠️  Please change the password after first login!');
        
        process.exit();
    } catch (error) {
        console.error(`❌ Error creating admin: ${error}`);
        process.exit(1);
    }
};

createAdmin();
