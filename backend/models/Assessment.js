const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    subject: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    type: { type: String, required: true }, // Quiz, Assignment, Exam
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
