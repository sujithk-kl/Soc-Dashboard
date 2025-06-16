// server/controllers/userController.js

const { ROLES } = require("../config/roles");

// In a real application, this would be a database model.
// For now, it's an in-memory array that simulates our user database.
const mockUsers = [
    { id: 1, email: 'admin@soc.com', password: 'password123', name: 'Alice Admin', initials: 'AA', role: ROLES.ADMIN },
    { id: 2, email: 'analyst@soc.com', password: 'password123', name: 'John Doe', initials: 'JD', role: ROLES.ANALYST },
    { id: 3, email: 'viewer@soc.com', password: 'password123', name: 'Bob Viewer', initials: 'BV', role: ROLES.VIEWER },
];

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const { password: _, ...userToSend } = user;
    res.status(200).json({
        message: 'Login successful!',
        user: userToSend,
    });
};

// --- NEW REGISTER FUNCTION ---
const register = (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return res.status(409).json({ message: 'An account with this email already exists.' }); // 409 Conflict
    }

    // Create the new user object. By default, new users are assigned the 'Viewer' role.
    const newUser = {
        id: mockUsers.length + 1, // Simple ID generation
        name,
        email,
        password, // In a real app, hash this password!
        role: ROLES.VIEWER, // New users default to Viewer
        initials: name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
    };

    mockUsers.push(newUser);
    console.log("New user registered:", newUser);
    console.log("Current user list:", mockUsers);

    res.status(201).json({ message: 'User registered successfully! You can now log in.' }); // 201 Created
};

module.exports = {
    login,
    register, // Export the new function
};