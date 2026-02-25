const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Grade = require('../models/Grade');

// Helper function to calculate grade from total marks (Scale of 200)
// This matches the frontend logic
const calculateGrade = (total) => {
    const percentage = (total / 200) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
};

// Submit/Update grades for a student
router.post('/', async (req, res) => {
    try {
        const { regNo, subject, m1, m2, assignment, semester, credits } = req.body;

        const student = await Student.findOne({ regNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const total = (m1 || 0) + (m2 || 0) + (assignment || 0) + (semester || 0);
        const gradeLetter = calculateGrade(total);

        // Find or create Grade document for this student + year
        let gradeDoc = await Grade.findOne({ studentRegNo: regNo, year: student.year });

        if (!gradeDoc) {
            gradeDoc = new Grade({
                studentRegNo: regNo,
                year: student.year,
                department: student.department, // Store current department
                subjects: []
            });
        }

        // Check if subject exists in the subjects array
        const subjectIndex = gradeDoc.subjects.findIndex(s => s.subjectName === subject);

        if (subjectIndex !== -1) {
            // Update existing subject
            gradeDoc.subjects[subjectIndex] = {
                subjectName: subject,
                m1: m1 || 0,
                m2: m2 || 0,
                assignment: assignment || 0,
                semester: semester || 0,
                total,
                grade: gradeLetter,
                credits: credits || 3
            };
        } else {
            // Add new subject
            gradeDoc.subjects.push({
                subjectName: subject,
                m1: m1 || 0,
                m2: m2 || 0,
                assignment: assignment || 0,
                semester: semester || 0,
                total,
                grade: gradeLetter,
                credits: credits || 3
            });
        }

        gradeDoc.updatedAt = Date.now();
        await gradeDoc.save();

        res.json({ message: "Grades submitted successfully", gradeDoc });
    } catch (err) {
        console.error("Error saving grade:", err);
        res.status(400).json({ message: err.message });
    }
});

// Get all grades for a student
router.get('/:regNo', async (req, res) => {
    try {
        const { regNo } = req.params;
        const student = await Student.findOne({ regNo });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Fetch grades from Grade collection
        const gradeDocs = await Grade.find({ studentRegNo: regNo });

        // Flatten subjects from all years (if multiple)
        let allGrades = [];
        gradeDocs.forEach(doc => {
            const subjectsWithYear = doc.subjects.map(s => ({
                subject: s.subjectName,
                m1: s.m1,
                m2: s.m2,
                semester: s.semester,
                assignment: s.assignment,
                total: s.total,
                grade: s.grade,
                credits: s.credits,
                year: doc.year
            }));
            allGrades = [...allGrades, ...subjectsWithYear];
        });

        // Calculate CGPA (Mock calculation based on grades present)
        // Note: Real CGPA would need proper credit weighting logic
        let cgpa = 0;
        if (allGrades.length > 0) {
            // Simple mapping for grade points
            const getPoints = (grade) => {
                if (grade === 'A+') return 10;
                if (grade === 'A') return 9;
                if (grade === 'B+') return 8;
                if (grade === 'B') return 7;
                if (grade === 'C') return 6;
                return 0;
            };

            const totalPoints = allGrades.reduce((sum, g) => sum + getPoints(g.grade), 0);
            cgpa = (totalPoints / allGrades.length).toFixed(2);
        }

        res.json({
            regNo: student.regNo,
            name: student.name,
            grades: allGrades, // Format matches what frontend expects (array of grade objects)
            cgpa: parseFloat(cgpa)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get grades for all students in a class (year + department)
// Used by Faculty Portal to populate the grid
router.get('/class/:year/:department', async (req, res) => {
    try {
        const { year, department } = req.params;

        // 1. Get all students for this class
        const students = await Student.find({ year, department });

        // 2. Get all grades for these students for this year
        const studentRegNos = students.map(s => s.regNo);
        const grades = await Grade.find({
            studentRegNo: { $in: studentRegNos },
            year: year
        });

        // 3. Merge data
        // Map grades by regNo for faster lookup
        const gradeMap = {};
        grades.forEach(g => {
            gradeMap[g.studentRegNo] = g.subjects;
        });

        const studentsWithGrades = students.map(student => {
            const studentGrades = gradeMap[student.regNo] || [];

            // Map to format expected by frontend
            const formattedGrades = studentGrades.map(s => ({
                subject: s.subjectName,
                m1: s.m1,
                m2: s.m2,
                semester: s.semester,
                assignment: s.assignment,
                total: s.total,
                grade: s.grade,
                credits: s.credits
            }));

            return {
                regNo: student.regNo, // Frontend often looks for id/regNo
                id: student.regNo,    // Ensure ID is available
                name: student.name,
                section: student.section,
                grades: formattedGrades
                // CGPA could be added here if needed
            };
        });

        res.json(studentsWithGrades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
