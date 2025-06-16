// server/models/userModel.js
const mongoose = require('mongoose');

// In a real app, you would add a pre-save hook here to hash the password with bcrypt.
const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Admin', 'Analyst', 'Viewer'] },
    initials: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;