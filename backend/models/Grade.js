const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
    studentRegNo: { type: String, required: true },
    year: { type: String, required: true }, // e.g., "3rd"
    department: { type: String, required: true },
    subjects: [{
        subjectName: { type: String, required: true },
        m1: { type: Number, default: 0 },
        m2: { type: Number, default: 0 },
        semester: { type: Number, default: 0 },
        assignment: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
        grade: { type: String, default: 'F' },
        credits: { type: Number, default: 3 }
    }],
    updatedAt: { type: Date, default: Date.now }
});

// Compound index to ensure one grade document per student per year
GradeSchema.index({ studentRegNo: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Grade', GradeSchema);
