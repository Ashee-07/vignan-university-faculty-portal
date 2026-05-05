const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: String, required: true },
    year: { type: String }, // e.g., "2024"
    targetYear: { type: String }, // e.g., "3rd"
    section: { type: String }, // Optional now
    fileUrl: { type: String },
    fileType: { type: String },
    totalMarks: { type: String },
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
