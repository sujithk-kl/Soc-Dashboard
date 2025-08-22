// server/controllers/userController.js
const User = require('../models/userModel');
const { ROLES } = require("../config/roles");

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check if user is blocked
        if (user.status === 'blocked') {
            return res.status(403).json({ message: 'Your account has been blocked. Please contact an administrator.' });
        }

        // Use bcrypt to compare passwords
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Check if password needs rehashing (for security upgrades)
        if (user.needsRehash()) {
            user.password = password; // This will trigger the pre-save hook to rehash
            await user.save();
        }

        const { password: _, ...userToSend } = user.toObject();
        res.status(200).json({ message: 'Login successful!', user: userToSend });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error.' });
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

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        if (user.role === ROLES.ADMIN) {
            return res.status(403).json({ message: 'Cannot change password for Admin users via this endpoint.' });
        }

        // Update password - the pre-save hook will hash it automatically
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Admin: delete user
const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Prevent deleting the last admin
        if (user.role === ROLES.ADMIN) {
            const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
            if (adminCount <= 1) {
                return res.status(403).json({ message: 'Cannot delete the last admin user.' });
            }
        }

        // Prevent admin from deleting themselves
        const requesterId = req.user?._id;
        if (requesterId && requesterId.toString() === id) {
            return res.status(403).json({ message: 'Cannot delete your own account.' });
        }

        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Admin: block/unblock user
const toggleUserStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        // Prevent blocking the last admin
        if (user.role === ROLES.ADMIN) {
            const activeAdminCount = await User.countDocuments({ role: ROLES.ADMIN, status: 'active' });
            if (activeAdminCount <= 1 && user.status === 'active') {
                return res.status(403).json({ message: 'Cannot block the last active admin user.' });
            }
        }

        // Prevent admin from blocking themselves
        const requesterId = req.user?._id;
        if (requesterId && requesterId.toString() === id) {
            return res.status(403).json({ message: 'Cannot block your own account.' });
        }

        // Toggle status
        user.status = user.status === 'active' ? 'blocked' : 'active';
        await user.save();

        const action = user.status === 'active' ? 'unblocked' : 'blocked';
        res.status(200).json({ message: `User ${action} successfully.` });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// Public: get user role by email (for client-side gating on IAM login)
const getUserRoleByEmail = async (req, res) => {
    try {
        const email = (req.query.email || '').toLowerCase();
        if (!email) return res.status(400).json({ message: 'Email is required.' });
        const user = await User.findOne({ email }, { role: 1, _id: 0 });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        return res.status(200).json({ role: user.role });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = { login, register, listUsers, updatePassword, deleteUser, toggleUserStatus, getUserRoleByEmail };