const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @route POST /api/auth/login
// @desc Auth user & get token
// @access Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            let extraInfo = null;
            if (user.role === 'Student') {
                extraInfo = await Student.findOne({ user: user._id }).populate('studentClass');
            } else if (user.role === 'Teacher') {
                extraInfo = await Teacher.findOne({ user: user._id });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
                extraInfo
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/auth/profile
// @desc Get user profile
// @access Private
const { protect } = require('../middleware/authMiddleware');
router.get('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

module.exports = router;
