const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// GET all admins
router.get('/', async (req, res) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new admin
router.post('/', async (req, res) => {
    try {
        const { adminId, password, department, name } = req.body;
        const exists = await Admin.findOne({ adminId });
        if (exists) return res.status(400).json({ message: "Admin ID already exists" });

        const newAdmin = new Admin({ adminId, password, department, name });
        const saved = await newAdmin.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
