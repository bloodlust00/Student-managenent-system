const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true
    },
    studentClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    },
    parentName: {
        type: String
    },
    parentContact: {
        type: String
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
