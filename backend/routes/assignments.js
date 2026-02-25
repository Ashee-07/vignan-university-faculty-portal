const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const multer = require('multer');

const multr = require('multer');
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

router.get('/', async (req, res) => {
    try {
        const { facultyId, targetYear, subject } = req.query;
        let query = {};
        if (facultyId) query.facultyId = facultyId;
        if (targetYear) query.targetYear = targetYear;
        if (subject) query.subject = subject;

        const assignments = await Assignment.find(query).sort({ createdAt: -1 });
        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { facultyId, subject, title, description, deadline, year, targetYear, totalMarks, type, fileType } = req.body;

        let fileUrl = '';
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const newAssignment = new Assignment({
            facultyId: facultyId || 'FAC001',
            subject,
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
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update assignment
router.put('/:id', async (req, res) => {
    try {
        const updated = await Assignment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
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
