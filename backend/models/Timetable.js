const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    faculty: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
    subject: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, default: "N/A" },
    room: { type: String, required: true },
    type: { type: String, required: true }, // Lecture, Practical, etc.
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Timetable', TimetableSchema);
