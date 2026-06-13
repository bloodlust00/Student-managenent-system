const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');
const Notice = require('../models/Notice');
const bcrypt = require('bcryptjs');

// @route GET /api/admin/dashboard
// @desc Get dashboard stats
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const studentsCount = await Student.countDocuments();
        const teachersCount = await Teacher.countDocuments();
        const classesCount = await Class.countDocuments();
        const notices = await Notice.find().sort({ createdAt: -1 }).limit(5);

        res.json({
            studentsCount,
            teachersCount,
            classesCount,
            recentNotices: notices,
            feesCollection: 250000 // Dummy data for fees
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/admin/profile
// @desc Get admin profile
router.get('/profile', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ profile: user });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/admin/teachers
// @desc Get all teachers
router.get('/teachers', protect, admin, async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('user', '-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/admin/teachers
// @desc Create a new teacher
router.post('/teachers', protect, admin, async (req, res) => {
    const { name, email, password, employeeId, subject } = req.body;

    try {
        // Check if user exists
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if teacher exists by employeeId
        let teacherExists = await Teacher.findOne({ employeeId });
        if (teacherExists) {
            return res.status(400).json({ message: 'Employee ID already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Teacher'
        });

        // Create teacher profile
        const teacher = await Teacher.create({
            user: user._id,
            employeeId,
            subject
        });

        const createdTeacher = await Teacher.findById(teacher._id).populate('user', '-password');

        res.status(201).json(createdTeacher);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
