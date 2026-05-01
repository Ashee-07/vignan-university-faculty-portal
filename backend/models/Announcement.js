const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    facultyName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    targetYear: { type: String, default: 'All' },
    targetSection: { type: String, default: 'All' },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    date: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
