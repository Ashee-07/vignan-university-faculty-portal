const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    facultyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    assignedSubjects: [{
        subject: { type: String },
        year: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faculty', FacultySchema);
