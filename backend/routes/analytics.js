const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Faculty = require('../models/Faculty');

// Get attendance percentage for a specific student
router.get('/attendance/:regNo', async (req, res) => {
    try {
        const { regNo } = req.params;
        const student = await Student.findOne({ regNo });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Count total classes for this student's year and department
        const totalClasses = await Attendance.countDocuments({
            year: student.year,
            'students.regNo': regNo
        });

        // Count classes where student was present
        const presentClasses = await Attendance.countDocuments({
            year: student.year,
            'students': {
                $elemMatch: {
                    regNo: regNo,
                    status: 'Present'
                }
            }
        });

        const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

        res.json({
            regNo,
            name: student.name,
            totalClasses,
            presentClasses,
            absentClasses: totalClasses - presentClasses,
            attendancePercentage: parseFloat(percentage)
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get attendance stats for all students in a class (year + department)
router.get('/attendance/class/:year/:department', async (req, res) => {
    try {
        const { year, department } = req.params;

        const students = await Student.find({ year, department });

        const stats = await Promise.all(students.map(async (student) => {
            const totalClasses = await Attendance.countDocuments({
                year: student.year,
                'students.regNo': student.regNo
            });

            const presentClasses = await Attendance.countDocuments({
                year: student.year,
                'students': {
                    $elemMatch: {
                        regNo: student.regNo,
                        status: 'Present'
                    }
                }
            });

            const percentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

            return {
                regNo: student.regNo,
                name: student.name,
                section: student.section,
                totalClasses,
                presentClasses,
                attendancePercentage: parseFloat(percentage)
            };
        }));

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get students taught by a specific faculty (with attendance %)
router.get('/faculty/:facultyId/students', async (req, res) => {
    try {
        const { facultyId } = req.params;

        const faculty = await Faculty.findOne({ facultyId });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // Get unique years from assigned subjects
        const assignedYears = [...new Set(faculty.assignedSubjects.map(s => s.year))];

        // Get students in those years and same department
        const students = await Student.find({
            year: { $in: assignedYears },
            department: faculty.department
        });

        // Calculate attendance % for each student
        const studentsWithStats = await Promise.all(students.map(async (student) => {
            const totalClasses = await Attendance.countDocuments({
                year: student.year,
                'students.regNo': student.regNo
            });

            const presentClasses = await Attendance.countDocuments({
                year: student.year,
                'students': {
                    $elemMatch: {
                        regNo: student.regNo,
                        status: 'Present'
                    }
                }
            });

            const attendancePercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(2) : 0;

            // Calculate CGPA if grades exist
            let cgpa = 0;
            if (student.grades && student.grades.length > 0) {
                const totalCredits = student.grades.reduce((sum, g) => sum + (g.credits || 3), 0);
                const weightedSum = student.grades.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credits || 3), 0);
                cgpa = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;
            }

            return {
                regNo: student.regNo,
                name: student.name,
                year: student.year,
                section: student.section,
                email: student.email,
                attendancePercentage: parseFloat(attendancePercentage),
                cgpa: parseFloat(cgpa),
                totalClasses,
                presentClasses
            };
        }));

        res.json(studentsWithStats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get department-wide analytics
router.get('/department/:dept', async (req, res) => {
    try {
        const { dept } = req.params;

        const students = await Student.find({ department: dept });

        let totalAttendanceSum = 0;
        let totalCgpaSum = 0;
        let studentsWithGrades = 0;

        for (const student of students) {
            // Calculate attendance %
            const totalClasses = await Attendance.countDocuments({
                year: student.year,
                'students.regNo': student.regNo
            });

            const presentClasses = await Attendance.countDocuments({
                year: student.year,
                'students': {
                    $elemMatch: {
                        regNo: student.regNo,
                        status: 'Present'
                    }
                }
            });

            const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;
            totalAttendanceSum += attendancePercentage;

            // Calculate CGPA if grades exist
            if (student.grades && student.grades.length > 0) {
                const totalCredits = student.grades.reduce((sum, g) => sum + (g.credits || 3), 0);
                const weightedSum = student.grades.reduce((sum, g) => sum + (g.gradePoint || 0) * (g.credits || 3), 0);
                const cgpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
                totalCgpaSum += cgpa;
                studentsWithGrades++;
            }
        }

        const avgAttendance = students.length > 0 ? (totalAttendanceSum / students.length).toFixed(2) : 0;
        const avgCgpa = studentsWithGrades > 0 ? (totalCgpaSum / studentsWithGrades).toFixed(2) : 0;

        res.json({
            department: dept,
            totalStudents: students.length,
            avgAttendance: parseFloat(avgAttendance),
            avgCgpa: parseFloat(avgCgpa),
            studentsWithGrades
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
