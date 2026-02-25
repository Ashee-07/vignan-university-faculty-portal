const express = require('express');
const router = express.Router();
const QuestionPaper = require('../models/QuestionPaper');
const multer = require('multer');
const path = require('path');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
    try {
        const { year, subject, targetYear, facultyId } = req.query;
        let query = {};
        if (year) query.year = year;
        if (subject) query.subject = subject;
        if (targetYear) query.targetYear = targetYear;
        if (facultyId) query.facultyId = facultyId;

        const papers = await QuestionPaper.find(query).sort({ createdAt: -1 });
        res.json(papers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        const { facultyId, subject, title, year, type, module, topic, fileType, targetYear } = req.body;

        let fileUrl = '';
        if (req.file) {
            fileUrl = `/uploads/${req.file.filename}`;
        }

        const newPaper = new QuestionPaper({
            facultyId: facultyId || 'FAC001', // Fallback for now if not sent
            subject,
            title,
            year,
            type,
            module,
            topic,
            fileType,
            targetYear,
            url: fileUrl
        });

        const saved = await newPaper.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a question paper
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await QuestionPaper.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Paper not found" });
        res.json({ message: "Paper deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
