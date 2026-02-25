const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');

// GET all timetable entries
router.get('/', async (req, res) => {
    try {
        const timetable = await Timetable.find();
        res.json(timetable);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET entries by facultyId
router.get('/faculty/:facultyId', async (req, res) => {
    try {
        const entries = await Timetable.find({ facultyId: req.params.facultyId });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new timetable entry
router.post('/', async (req, res) => {
    try {
        const newEntry = new Timetable(req.body);
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update timetable entry
router.put('/:id', async (req, res) => {
    try {
        const updated = await Timetable.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Slot not found" });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE timetable entry
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Timetable.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Slot not found" });
        res.json({ message: "Slot deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
