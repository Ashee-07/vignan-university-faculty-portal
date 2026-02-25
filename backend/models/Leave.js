const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema({
    facultyId: { type: String, required: true },
    facultyName: { type: String, required: true },
    type: { type: String, required: true }, // Sick, Casual, etc.
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    days: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    submittedDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Leave', LeaveSchema);
