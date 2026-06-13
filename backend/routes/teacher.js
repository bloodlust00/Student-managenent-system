const express = require('express');
const router = express.Router();
const { protect, teacher } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Student = require('../models/Student');
const Class = require('../models/Class');
const Attendance = require('../models/Attendance');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');

// @route GET /api/teacher/dashboard
router.get('/dashboard', protect, teacher, async (req, res) => {
    try {
        const teacherProfile = await Teacher.findOne({ user: req.user._id });
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher profile not found' });
        
        const classes = await Class.find({ teacher: teacherProfile._id });
        const classIds = classes.map(c => c._id);
        const studentCount = await Student.countDocuments({ studentClass: { $in: classIds } });
        
        res.json({
            classesCount: classes.length,
            studentCount: studentCount,
            teacherDetails: teacherProfile
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/teacher/profile
// @desc Get teacher profile
router.get('/profile', protect, teacher, async (req, res) => {
    try {
        const teacherProfile = await Teacher.findOne({ user: req.user._id }).populate('user', '-password');
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher profile not found' });
        
        res.json({ profile: teacherProfile });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/teacher/classes
// @desc Create a new class/section assigned to this teacher
router.post('/classes', protect, teacher, async (req, res) => {
    const { name, section } = req.body;
    try {
        const teacherProfile = await Teacher.findOne({ user: req.user._id });
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher profile not found' });

        const newClass = await Class.create({
            name,
            section,
            teacher: teacherProfile._id
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/teacher/classes
// @desc Get classes assigned to this teacher
router.get('/classes', protect, teacher, async (req, res) => {
    try {
        const teacherProfile = await Teacher.findOne({ user: req.user._id });
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher profile not found' });

        const classes = await Class.find({ teacher: teacherProfile._id });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/teacher/students
// @desc Create a new student user
router.post('/students', protect, teacher, async (req, res) => {
    const { name, email, password, rollNumber, classId, parentName, parentContact } = req.body;

    try {
        let userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        let studentExists = await Student.findOne({ rollNumber });
        if (studentExists) return res.status(400).json({ message: 'Roll number already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'Student'
        });

        const student = await Student.create({
            user: user._id,
            rollNumber,
            studentClass: classId,
            parentName,
            parentContact
        });

        const createdStudent = await Student.findById(student._id).populate('user', '-password').populate('studentClass');
        res.status(201).json(createdStudent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route GET /api/teacher/classes/:classId/students
// @desc Get students for a specific class
router.get('/classes/:classId/students', protect, teacher, async (req, res) => {
    try {
        const students = await Student.find({ studentClass: req.params.classId }).populate('user', '-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route POST /api/teacher/attendance
// @desc Submit attendance for a class
router.post('/attendance', protect, teacher, async (req, res) => {
    const { classId, date, attendanceData } = req.body; 
    // attendanceData is an array of { studentId, status }
    
    try {
        // Simple iteration to save each record. Real world: bulkWrite.
        for (const record of attendanceData) {
            await Attendance.findOneAndUpdate(
                { student: record.studentId, classRef: classId, date: new Date(date) },
                { status: record.status },
                { upsert: true, new: true }
            );
        }
        res.json({ message: 'Attendance saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
