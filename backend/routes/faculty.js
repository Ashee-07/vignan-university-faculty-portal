const express = require('express');
const router = express.Router();
const Faculty = require('../models/Faculty');

// GET all faculty
router.get('/', async (req, res) => {
    try {
        const faculty = await Faculty.find();
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single faculty by ID
router.get('/:id', async (req, res) => {
    try {
        const faculty = await Faculty.findById(req.params.id);
        if (!faculty) return res.status(404).json({ message: "Faculty not found" });
        res.json(faculty);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new faculty
router.post('/', async (req, res) => {
    try {
        const { facultyId, name, department, email, password, assignedSubjects } = req.body;

        // Check if exists
        const exists = await Faculty.findOne({ facultyId });
        if (exists) return res.status(400).json({ message: "Faculty ID already exists" });

        const newFaculty = new Faculty({
            facultyId, name, department, email, password, assignedSubjects
        });

        const savedFaculty = await newFaculty.save();
        res.status(201).json(savedFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update assignments
router.put('/:id', async (req, res) => {
    try {
        const updatedFaculty = await Faculty.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedFaculty);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT change password
router.put('/change-password/:facultyId', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const faculty = await Faculty.findOne({ facultyId: req.params.facultyId });

        if (!faculty) return res.status(404).json({ message: "Faculty not found" });
        if (faculty.password !== currentPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        faculty.password = newPassword;
        await faculty.save();
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE faculty
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Faculty.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Faculty not found" });
        res.json({ message: "Faculty deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
