const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true }, // PDF, Video, Link
    url: { type: String, required: true },
    year: { type: String, required: true },
    department: { type: String, required: true },
    facultyName: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Material', MaterialSchema);
