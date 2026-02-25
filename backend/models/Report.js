const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, default: 'Generated' },
    date: { type: String, required: true },
    downloadUrl: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
