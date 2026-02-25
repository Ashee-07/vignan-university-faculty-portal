const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
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

router.get('/', async (req, res) => {
    try {
        const { facultyId, year, department, subject } = req.query;
        let query = {};
        if (facultyId) query.facultyId = facultyId;
        if (year) query.year = year;
        if (department) query.department = department;
        if (subject) query.subject = subject;

        const materials = await Material.find(query).sort({ createdAt: -1 });
        res.json(materials);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', upload.single('file'), async (req, res) => {
    try {
        console.log('--- Material Upload Request ---');
        console.log('Body:', req.body);
        console.log('File:', req.file);

        const { facultyId, subject, title, type, year, department, facultyName, description } = req.body;

        let url = '';
        if (req.file) {
            url = `/uploads/${req.file.filename}`;
        }

        const newMaterial = new Material({
            facultyId,
            subject,
            title,
            type,
            url,
            year,
            department,
            facultyName,
            description
        });

        const saved = await newMaterial.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update material
router.put('/:id', async (req, res) => {
    try {
        const updated = await Material.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Material not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a material
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Material.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Material not found" });
        res.json({ message: "Material deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
