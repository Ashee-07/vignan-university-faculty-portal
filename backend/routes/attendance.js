const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

router.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find().sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { facultyId, subject, year, section, date, period } = req.body;

        // Check if attendance already exists for this combination (Class + Date + Period)
        // We removed facultyId and subject to ensure ONLY ONE attendance record per class/period
        const existing = await Attendance.findOne({
            year,
            section,
            date,
            period
        });

        if (existing) {
            return res.status(409).json({
                message: "Attendance already marked for this class/period/date by a faculty member.",
                duplicate: true
            });
        }

        const newAttendance = new Attendance(req.body);
        const saved = await newAttendance.save();
        res.status(201).json(saved);
    } catch (err) {
        // Handle unique index violation (in case of race condition)
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Attendance already marked for this class/period/date.",
                duplicate: true
            });
        }
        res.status(400).json({ message: err.message });
    }
});

// Get attendance for a specific student
router.get('/student/:regNo', async (req, res) => {
    try {
        const { regNo } = req.params;
        // Find all attendance records where this student is present/absent
        const attendance = await Attendance.find({
            "students.regNo": regNo
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
