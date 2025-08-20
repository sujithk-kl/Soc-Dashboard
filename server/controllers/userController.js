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
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required.' });

    const allowedRoles = Object.values(ROLES);
    let requestedRole = allowedRoles.includes(role) ? role : ROLES.VIEWER;

    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });

    // Bootstrap rule: if no admins exist yet, only allow creating an Admin
    if (adminCount === 0) {
        if (requestedRole !== ROLES.ADMIN) {
            return res.status(403).json({ message: 'First user must be an Admin.' });
        }
    } else {
        // After bootstrap: only an Admin can create accounts (via header role)
        const requesterRole = req.header('X-User-Role');
        if (requesterRole !== ROLES.ADMIN) {
            return res.status(403).json({ message: 'Only Admin can create new accounts.' });
        }
    }

    // Enforce admin cap: maximum of 2 Admin users allowed
    if (requestedRole === ROLES.ADMIN && adminCount >= 2) {
        return res.status(403).json({ message: 'Admin limit reached (maximum 2). Please choose a different role.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: 'An account with this email already exists.' });

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
    
    const user = await User.create({
        name,
        email,
        password,
        role: requestedRole,
        initials,
    });

    if (user) {
        res.status(201).json({ message: 'User registered successfully! You can now log in.' });
    } else {
        res.status(400).json({ message: 'Invalid user data.' });
    }
};

// Admin: list users (without passwords)
const listUsers = async (req, res) => {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.status(200).json(users);
};

// Admin: update password for Analyst/Viewer users
const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;
    if (!newPassword) return res.status(400).json({ message: 'New password is required.' });

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user.role === ROLES.ADMIN) {
        return res.status(403).json({ message: 'Cannot change password for Admin users via this endpoint.' });
    }

    user.password = newPassword; // In production, hash this
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
};

module.exports = { login, register, listUsers, updatePassword };