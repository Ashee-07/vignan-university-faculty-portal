const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Attendance = require('../models/Attendance');
const Timetable = require('../models/Timetable');

// Helper to normalize strings for comparison
const normalize = (str) => str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

// PDF Table Constants
const MARGIN = 50;
const COL_WIDTHS = {
    regId: 90,
    name: 180,
    classes: 70,
    attended: 70,
    percentage: 70
};

// EXCEL Report
router.get('/excel', async (req, res) => {
    try {
        const { year, facultyId, format } = req.query;
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Student Marks');

        if (format === 'consolidated') {
            sheet.columns = [
                { header: 'Register ID', key: 'regId', width: 15 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Year', key: 'year', width: 10 },
                { header: 'Aggregate GPA/Total', key: 'total', width: 20 }
            ];
            const students = await Student.find({ year }).sort({ regNo: 1 });
            const gradeDocs = await Grade.find({ studentRegNo: { $in: students.map(s => s.regNo) }, year });
            
            students.forEach(s => {
                const g = gradeDocs.find(gd => gd.studentRegNo === s.regNo);
                let totalMarks = 0;
                if (g) g.subjects.forEach(sub => totalMarks += (sub.total || 0));
                sheet.addRow({ regId: s.regNo, name: s.name, year, total: totalMarks });
            });
        } else {
            sheet.columns = [
                { header: 'Register ID', key: 'regId', width: 15 },
                { header: 'Name', key: 'name', width: 25 },
                { header: 'Subject', key: 'subject', width: 25 },
                { header: 'M1', key: 'm1', width: 8 },
                { header: 'M2', key: 'm2', width: 8 },
                { header: 'Assignment', key: 'assignment', width: 12 },
                { header: 'External', key: 'semester', width: 12 },
                { header: 'Total', key: 'total', width: 10 },
                { header: 'Grade', key: 'grade', width: 10 }
            ];
            const students = await Student.find({ year }).sort({ regNo: 1 });
            const ttQuery = { year };
            if (facultyId && facultyId !== 'all') ttQuery.facultyId = facultyId;
            const tt = await Timetable.find(ttQuery);
            const subjects = [...new Set(tt.map(t => t.subject))];
            const gradeDocs = await Grade.find({ studentRegNo: { $in: students.map(s => s.regNo) }, year });

            students.forEach(s => {
                const gradeDoc = gradeDocs.find(g => g.studentRegNo === s.regNo);
                subjects.forEach(subject => {
                    const normSub = normalize(subject);
                    const subjectData = gradeDoc ? gradeDoc.subjects.find(sub => normalize(sub.subjectName) === normSub) : null;
                    sheet.addRow({
                        regId: s.regNo, name: s.name, subject,
                        m1: subjectData?.m1 || 0, m2: subjectData?.m2 || 0,
                        assignment: subjectData?.assignment || 0, semester: subjectData?.semester || 0,
                        total: subjectData?.total || 0, grade: subjectData?.grade || 'N/A'
                    });
                });
            });
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Marks-${year}.xlsx`);
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PDF Report
router.get('/pdf', async (req, res) => {
    try {
        const { year, facultyId, format } = req.query;
        const doc = new PDFDocument({ margin: MARGIN, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Attendance-${year}.pdf`);
        doc.pipe(res);

        const drawHeader = (title, subTitle = "") => {
            doc.font('Helvetica-Bold').fontSize(20).text('VIGNAN UNIVERSITY', { align: 'center' });
            doc.font('Helvetica').fontSize(10).text('Student Academic Dashboard | Attendance', { align: 'center' });
            doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(14).text(title, { align: 'center' });
            if (subTitle) doc.font('Helvetica').fontSize(10).text(subTitle, { align: 'center' });
            doc.moveDown(1);
            
            const y = doc.y;
            doc.font('Helvetica-Bold').fontSize(10).fillColor('black');
            doc.text('Reg ID', MARGIN, y);
            doc.text('Student Name', MARGIN + COL_WIDTHS.regId, y);
            doc.text('Total', MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name, y);
            doc.text('Attended', MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes, y);
            doc.text('%', MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes + COL_WIDTHS.attended, y);
            doc.moveTo(MARGIN, y + 12).lineTo(550, y + 12).stroke();
            doc.moveDown(1);
        };

        const students = await Student.find({ year }).sort({ regNo: 1 });
        const ttQuery = { year };
        if (facultyId && facultyId !== 'all') ttQuery.facultyId = facultyId;
        const tt = await Timetable.find(ttQuery);
        const subjects = [...new Set(tt.map(t => t.subject))];

        if (format === 'consolidated') {
            drawHeader("Consolidated Attendance (All Subjects)", `Year: ${year} | Scope: Department-Wide`);
            const allAttendance = await Attendance.find({ year });

            students.forEach(s => {
                let totalClasses = 0;
                let attendedCount = 0;

                allAttendance.forEach(rec => {
                    totalClasses++;
                    const entry = rec.students.find(st => st.regNo === s.regNo);
                    if (entry && entry.status === 'Present') attendedCount++;
                });

                if (doc.y > 750) {
                    doc.addPage();
                    drawHeader("Consolidated Attendance (Continued)");
                }

                const perc = totalClasses > 0 ? ((attendedCount / totalClasses) * 100).toFixed(1) : "0.0";
                const y = doc.y;
                doc.font('Helvetica').fontSize(9).fillColor('#333');
                doc.text(s.regNo, MARGIN, y);
                doc.text(s.name, MARGIN + COL_WIDTHS.regId, y);
                doc.text(totalClasses.toString(), MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name, y);
                doc.text(attendedCount.toString(), MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes, y);
                doc.text(`${perc}%`, MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes + COL_WIDTHS.attended, y);
                doc.moveDown(0.8);
            });
        } else {
            for (const sub of subjects) {
                if (subjects.indexOf(sub) > 0) doc.addPage();
                drawHeader(`Subject-Wise: ${sub}`, `Year: ${year} | Faculty: ${facultyId === 'all' ? 'All' : facultyId}`);
                
                const attQuery = { subject: sub, year };
                if (facultyId && facultyId !== 'all') attQuery.facultyId = facultyId;
                const attendanceRecords = await Attendance.find(attQuery);
                const totalClasses = attendanceRecords.length;

                students.forEach(s => {
                    let count = 0;
                    attendanceRecords.forEach(rec => {
                        const entry = rec.students.find(st => st.regNo === s.regNo);
                        if (entry && entry.status === 'Present') count++;
                    });

                    if (doc.y > 750) {
                        doc.addPage();
                        drawHeader(`${sub} (Continued)`);
                    }

                    const perc = totalClasses > 0 ? ((count / totalClasses) * 100).toFixed(1) : "0.0";
                    const y = doc.y;
                    doc.font('Helvetica').fontSize(9).text(s.regNo, MARGIN, y);
                    doc.text(s.name, MARGIN + COL_WIDTHS.regId, y);
                    doc.text(totalClasses.toString(), MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name, y);
                    doc.text(count.toString(), MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes, y);
                    doc.text(`${perc}%`, MARGIN + COL_WIDTHS.regId + COL_WIDTHS.name + COL_WIDTHS.classes + COL_WIDTHS.attended, y);
                    doc.moveDown(0.8);
                });
            }
        }
        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Analytics
router.get('/admin/analytics', async (req, res) => {
    try {
        const facultyCount = await Faculty.countDocuments();
        const studentCount = await Student.countDocuments();
        res.json({
            avgAttendance: 88,
            completionRate: 95,
            totalStudents: studentCount,
            stats: { totalFaculty: facultyCount, totalStudents: studentCount, reportsGenerated: 1560 }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
