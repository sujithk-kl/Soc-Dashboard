// server/controllers/userController.js
const User = require('../models/userModel');
const { ROLES } = require("../config/roles");

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user && (password === user.password)) { // NOTE: In production, use bcrypt.compare()
        const { password, ...userToSend } = user.toObject();
        res.status(200).json({ message: 'Login successful!', user: userToSend });
    } else {
        res.status(401).json({ message: 'Invalid email or password.' });
    }
};

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    
    // In production, HASH the password here before saving
    const user = await User.create({
        name,
        email,
        password, // The plain password (for now)
        role: ROLES.VIEWER, // New users default to Viewer
        initials,
    });

    if (user) {
        res.status(201).json({ message: 'User registered successfully! You can now log in.' });
    } else {
        res.status(400).json({ message: 'Invalid user data.' });
    }
};

module.exports = { login, register };