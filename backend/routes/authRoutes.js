const express = require('express');
const prisma = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prismaClient = new prisma.PrismaClient();

// Replace with your own secret
const JWT_SECRET = 'your_secret_key';

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find user by username
    const user = await prismaClient.user.findUnique({
        where: { username: username },
    });

    if (user && bcrypt.compareSync(password, user.password)) {
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Sign up route (optional)
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await prismaClient.user.create({
            data: { username, password: hashedPassword },
        });
        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(400).json({ success: false, message: 'User already exists' });
    }
});

// Add this to your existing routes

// Logout route (optional, if you need server-side token invalidation)
router.post('/logout', (req, res) => {
    // Invalidate token on the server side if needed (e.g., add it to a blacklist)
    res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
