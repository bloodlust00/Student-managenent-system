const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// @route GET /api/student/dashboard
router.get('/dashboard', protect, async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ user: req.user._id }).populate('studentClass').populate('user', '-password');
        if (!studentProfile) return res.status(404).json({ message: 'Student profile not found' });
        
        const attendance = await Attendance.find({ student: studentProfile._id }).sort({ date: -1 });

        res.json({
            profile: studentProfile,
            attendance: attendance
        });
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/student/profile
// @desc Get student profile
router.get('/profile', protect, async (req, res) => {
    try {
        const studentProfile = await Student.findOne({ user: req.user._id }).populate('studentClass').populate('user', '-password');
        if (!studentProfile) return res.status(404).json({ message: 'Student profile not found' });
        
        res.json({ profile: studentProfile });
    } catch(error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
