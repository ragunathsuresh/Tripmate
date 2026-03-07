const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, confirmPassword, travelStyle } = req.body;

    // 1. Validate fields
    if (!name || !email || !password || !confirmPassword || !travelStyle) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        // 2. Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Create user
        const user = await User.create({
            name,
            email,
            password,
            travelStyle,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                travelStyle: user.travelStyle,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Please add email and password' });
    }

    try {
        // 2. Check for user email
        const user = await User.findOne({ email });

        // 3. Check password
        if (user && (await user.matchPassword(password))) {
            // 5. Return user info and token
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                travelStyle: user.travelStyle,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

module.exports = {
    registerUser,
    loginUser,
};
