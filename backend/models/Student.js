const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    regNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    section: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String },
    // grades: embedded array removed in favor of Grade collection
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
