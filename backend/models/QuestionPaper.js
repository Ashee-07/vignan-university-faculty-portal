const mongoose = require('mongoose');

const QuestionPaperSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: String, required: true },
    type: { type: String, required: true }, // Mid-1, Mid-2, Semester
    module: { type: String }, // e.g., "Module 1"
    topic: { type: String }, // e.g., "Data Structures"
    fileType: { type: String }, // e.g., "PDF", "DOC"
    targetYear: { type: String }, // e.g., "3rd" (Year of Study)
    url: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('QuestionPaper', QuestionPaperSchema);
