const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Faculty = require('../models/Faculty');
const Grade = require('../models/Grade');

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

        const students = await Student.find({ year, department }).sort({ regNo: 1 });

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
        }).sort({ regNo: 1 });

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

            // Calculate CGPA from Grade collection
            let cgpa = 0;
            const studentGradesDoc = await Grade.findOne({ studentRegNo: student.regNo, year: student.year });
            if (studentGradesDoc && studentGradesDoc.subjects && studentGradesDoc.subjects.length > 0) {
                const gradePointsMap = {
                    "A+": 10, "A": 9, "B+": 8, "B": 7, "C": 6, "F": 0
                };
                const totalPoints = studentGradesDoc.subjects.reduce((sum, s) => sum + (gradePointsMap[s.grade] || 0), 0);
                cgpa = (totalPoints / studentGradesDoc.subjects.length).toFixed(2);
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

        const students = await Student.find({ department: dept }).sort({ regNo: 1 });

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

            // Calculate CGPA from Grade collection
            const studentGradesDoc = await Grade.findOne({ studentRegNo: student.regNo, year: student.year });
            if (studentGradesDoc && studentGradesDoc.subjects && studentGradesDoc.subjects.length > 0) {
                const gradePointsMap = {
                    "A+": 10, "A": 9, "B+": 8, "B": 7, "C": 6, "F": 0
                };
                const totalPoints = studentGradesDoc.subjects.reduce((sum, s) => sum + (gradePointsMap[s.grade] || 0), 0);
                const cgpa = totalPoints / studentGradesDoc.subjects.length;
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
