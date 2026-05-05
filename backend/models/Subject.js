const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    year: { type: String, required: true }, // e.g., "1st", "2nd", "3rd", "4th"
    credits: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subject', SubjectSchema);
