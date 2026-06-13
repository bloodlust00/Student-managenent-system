const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // e.g., 'Grade 10'
    },
    section: {
        type: String,
        required: true // e.g., 'A'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
