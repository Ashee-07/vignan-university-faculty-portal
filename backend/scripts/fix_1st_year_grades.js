const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('../models/Student');
const Grade = require('../models/Grade');

dotenv.config();

const SUBJECTS_1ST_YEAR = [
    'Mathematics I', 'Engineering Physics', 'Problem Solving with C',
    'Engineering Graphics', 'Technical English', 'Environmental Science'
];

const calculateGrade = (total) => {
    const percentage = (total / 200) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
};

const fixGrades = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        // 1. Remove existing grades for 1st Year
        const deleteResult = await Grade.deleteMany({ year: '1st' });
        console.log(`🗑️ Removed ${deleteResult.deletedCount} grade records for 1st Year`);

        // 2. Find all 1st Year students
        const students = await Student.find({ year: '1st' });
        console.log(`🎓 Found ${students.length} students in 1st Year`);

        const gradeDocs = [];

        for (const student of students) {
            const studentSubjects = SUBJECTS_1ST_YEAR.map(subName => {
                const m1 = Math.floor(Math.random() * 10) + 15; // 15-24
                const m2 = Math.floor(Math.random() * 10) + 15; // 15-24
                const assignment = Math.floor(Math.random() * 15) + 30; // 30-44
                const semester = Math.floor(Math.random() * 40) + 50; // 50-89
                const total = m1 + m2 + assignment + semester;
                
                return {
                    subjectName: subName,
                    m1,
                    m2,
                    assignment,
                    semester,
                    total,
                    grade: calculateGrade(total),
                    credits: 3
                };
            });

            gradeDocs.push({
                studentRegNo: student.regNo,
                year: '1st',
                department: student.department || 'IT',
                subjects: studentSubjects,
                updatedAt: new Date()
            });
        }

        if (gradeDocs.length > 0) {
            await Grade.insertMany(gradeDocs);
            console.log(`✨ Successfully seeded grades for ${gradeDocs.length} students with correct subjects.`);
        }

        console.log('✅ Done!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

fixGrades();
