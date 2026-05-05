const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');

router.get('/', async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate('subjectId', 'name code')
            .populate('facultyId', 'name facultyId')
            .sort({ date: -1 });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { facultyId, subjectId, year, section, date, period } = req.body;

        const mongoose = require('mongoose');
        const Faculty = require('../models/Faculty');

        // Resolve facultyId if string provided instead of ObjectId
        let resolvedFacultyId = facultyId;
        if (facultyId && !mongoose.Types.ObjectId.isValid(facultyId)) {
            const fac = await Faculty.findOne({ facultyId: facultyId });
            if (fac) resolvedFacultyId = fac._id;
        }

        // Resolve subjectId if string provided instead of ObjectId
        let resolvedSubjectId = subjectId;
        if (subjectId && !mongoose.Types.ObjectId.isValid(subjectId)) {
            const sub = await Subject.findOne({ name: subjectId });
            if (sub) resolvedSubjectId = sub._id;
        }

        // Check if attendance already exists for this combination (Class + Date + Period)
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

        const newAttendance = new Attendance({
            facultyId: resolvedFacultyId,
            subjectId: resolvedSubjectId,
            year,
            section,
            date,
            period,
            students: req.body.students || []
        });
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
