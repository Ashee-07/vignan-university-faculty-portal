const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// GET all leave requests for admin
router.get('/admin/all', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ submittedDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET leave requests for faculty
router.get('/faculty/:facultyId', async (req, res) => {
    try {
        const leaves = await Leave.find({ facultyId: req.params.facultyId }).sort({ submittedDate: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST apply leave
router.post('/apply', async (req, res) => {
    try {
        const newLeave = new Leave(req.body);
        const saved = await newLeave.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update leave status
router.put('/admin/status/:id', async (req, res) => {
    try {
        const updated = await Leave.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
