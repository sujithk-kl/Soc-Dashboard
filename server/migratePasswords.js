// server/migratePasswords.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');

dotenv.config();

const migratePasswords = async () => {
    try {
        // Connect to your database
        const mongoURI = 'mongodb+srv://soc-dashboard:0TLjmT9WsLeY6BWK@cluster0.bchlfwm.mongodb.net/soc_dashboard';
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to database');

        // Get User model
        const User = require('./models/userModel');

        // Find all users
        const users = await User.find({});
        console.log(`📊 Found ${users.length} users to migrate`);

        let migratedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            try {
                // Check if password is already hashed (bcrypt hashes start with $2b$)
                if (user.password.startsWith('$2b$')) {
                    console.log(`⏭️  Skipping ${user.email} - password already hashed`);
                    skippedCount++;
                    continue;
                }

                // Hash the plain text password
                const saltRounds = 12;
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                
                // Update user with hashed password
                user.password = hashedPassword;
                await user.save();
                
                console.log(`✅ Migrated password for ${user.email}`);
                migratedCount++;
            } catch (error) {
                console.error(`❌ Error migrating ${user.email}:`, error.message);
            }
        }

        console.log('\n🎉 Migration completed!');
        console.log(`✅ Migrated: ${migratedCount} users`);
        console.log(`⏭️  Skipped: ${skippedCount} users (already hashed)`);
        
        process.exit(0);
    } catch (error) {
        console.error(`❌ Migration failed: ${error.message}`);
        process.exit(1);
    }
};

migratePasswords();
