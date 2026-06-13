const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    exam: {
        type: String,
        required: true // e.g., 'Midterm', 'Finals'
    },
    subject: {
        type: String,
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Marks', marksSchema);
