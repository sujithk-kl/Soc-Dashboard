// server/controllers/userController.js

const { ROLES } = require("../config/roles");

// In a real application, this would come from a database.
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

    // Find the user by email
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    // In a real app, you would use bcrypt.compare() to check a hashed password.
    // For this demo, we do a simple string comparison.
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Login successful. Return user data but OMIT the password.
    // In a real app, you would return a JWT (JSON Web Token) here.
    const { password: _, ...userToSend } = user;
    res.status(200).json({
        message: 'Login successful!',
        user: userToSend,
    });
};

module.exports = {
    login,
};