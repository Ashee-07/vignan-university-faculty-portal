const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students (with optional filtering)
router.get('/', async (req, res) => {
    try {
        const { department, year, section } = req.query;
        let filter = {};
        if (department) filter.department = department;
        if (year) filter.year = year;
        if (section) filter.section = section;

        const students = await Student.find(filter);
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one student by regNo
router.get('/:regNo', async (req, res) => {
    try {
        const student = await Student.findOne({ regNo: req.params.regNo });
        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new student
router.post('/', async (req, res) => {
    try {
        const { regNo, name, department, year, section, password, email } = req.body;
        const exists = await Student.findOne({ regNo });
        if (exists) return res.status(400).json({ message: "Student Registration No already exists" });

        const newStudent = new Student({ regNo, name, department, year, section, password, email });
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
