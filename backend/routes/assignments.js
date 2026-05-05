const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Faculty = require('../models/Faculty');
const Subject = require('../models/Subject');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// GET assignments - support facultyId, targetYear, subjectId filters
router.get('/', async (req, res) => {
    try {
        const { facultyId, targetYear, subjectId, subject } = req.query;
        let query = {};
        if (facultyId) {
            if (mongoose.Types.ObjectId.isValid(facultyId)) {
                query.facultyId = facultyId;
            } else {
                const fac = await Faculty.findOne({ facultyId: facultyId });
                if (fac) query.facultyId = fac._id;
                else return res.json([]); // If no faculty found, return empty results
            }
        }
        if (targetYear) query.targetYear = targetYear;
        if (subjectId) query.subjectId = subjectId;
        // If plain subject name provided, resolve to subjectId
        if (subject && !subjectId) {
            const sub = await Subject.findOne({ name: subject });
            if (sub) query.subjectId = sub._id;
        }
        const assignments = await Assignment.find(query)
            .populate('facultyId', 'name email')
            .populate('subjectId', 'name code credits')
            .sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create assignment
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { facultyId, subjectId, subject, title, description, deadline, year, targetYear, totalMarks, fileType } = req.body;
        
        let fileUrl = '';
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        // Resolve facultyId if string provided instead of ObjectId
        let resolvedFacultyId = facultyId;
        if (facultyId && !mongoose.Types.ObjectId.isValid(facultyId)) {
            const fac = await Faculty.findOne({ facultyId: facultyId });
            if (fac) resolvedFacultyId = fac._id;
        }

        // Resolve subjectId if only subject name provided
        let resolvedSubjectId = subjectId;
        if (!resolvedSubjectId && subject) {
            const sub = await Subject.findOne({ name: subject });
            if (sub) resolvedSubjectId = sub._id;
        }
        const newAssignment = new Assignment({
            facultyId: resolvedFacultyId,
            subjectId: resolvedSubjectId,
            title,
            description,
            deadline,
            year,
            targetYear,
            totalMarks,
            fileUrl,
            fileType,
            section: 'A' // Default/Optional
        });
        const saved = await newAssignment.save();
        const populated = await saved.populate(['facultyId', 'subjectId']);
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
    try {
        // If faculty readable ID provided, convert to ObjectId
        if (req.body.facultyId && !mongoose.Types.ObjectId.isValid(req.body.facultyId)) {
            const fac = await Faculty.findOne({ facultyId: req.body.facultyId });
            if (fac) req.body.facultyId = fac._id;
        }

        // If subject name provided, convert to subjectId
        if (req.body.subject && !req.body.subjectId) {
            const sub = await Subject.findOne({ name: req.body.subject });
            if (sub) req.body.subjectId = sub._id;
        }
        const updated = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('facultyId', 'name email').populate('subjectId', 'name code credits');
        if (!updated) return res.status(404).json({ message: "Assignment not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an assignment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Assignment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Assignment not found" });
        res.json({ message: "Assignment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
