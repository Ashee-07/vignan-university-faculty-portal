const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    adminId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    name: { type: String, default: 'Administrator' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
