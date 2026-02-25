const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    subject: { type: String, required: true },
    date: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    period: { type: String, required: true }, // "1", "2", "3", etc.
    students: [{
        regNo: { type: String, required: true },
        status: { type: String, enum: ['Present', 'Absent'], required: true }
    }],
    createdAt: { type: Date, default: Date.now }
});

// Compound unique index to prevent duplicate attendance for same class/date/period
AttendanceSchema.index({
    facultyId: 1,
    subject: 1,
    year: 1,
    section: 1,
    date: 1,
    period: 1
}, { unique: true });

module.exports = mongoose.model('Attendance', AttendanceSchema);
