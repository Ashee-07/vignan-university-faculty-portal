const express = require('express');
const router = express.Router();
const Assessment = require('../models/Assessment');

router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let query = {};
        if (year) query.year = year;
        const assessments = await Assessment.find(query);
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newAssessment = new Assessment(req.body);
        const saved = await newAssessment.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE an assessment
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Assessment.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Assessment not found" });
        res.json({ message: "Assessment deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
