const mongoose = require('mongoose');
const Student = require('./models/Student');
const Grade = require('./models/Grade');
require('dotenv').config({ path: './.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vignan_portal';

const calculateGrade = (total) => {
    const percentage = (total / 200) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
};

const seedGrades = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const students = await Student.find({ year: '1st' }).limit(40);
        console.log(`Found ${students.length} 1st year students`);

        const subjects = ['Mathematics I', 'Physics', 'Chemistry', 'English', 'Computer Science'];

        for (let student of students) {
            let gradeDoc = await Grade.findOne({ studentRegNo: student.regNo, year: student.year });

            if (!gradeDoc) {
                gradeDoc = new Grade({
                    studentRegNo: student.regNo,
                    year: student.year,
                    department: student.department,
                    subjects: []
                });
            }

            for (let subjectName of subjects) {
                const m1 = Math.floor(Math.random() * 26); // 0-25
                const m2 = Math.floor(Math.random() * 26); // 0-25
                const assignment = Math.floor(Math.random() * 51); // 0-50
                const semester = Math.floor(Math.random() * 101); // 0-100
                
                const total = m1 + m2 + assignment + semester;
                const grade = calculateGrade(total);

                const subjectIndex = gradeDoc.subjects.findIndex(s => s.subjectName === subjectName);

                if (subjectIndex !== -1) {
                    gradeDoc.subjects[subjectIndex] = {
                        subjectName, m1, m2, assignment, semester, total, grade, credits: 3
                    };
                } else {
                    gradeDoc.subjects.push({
                        subjectName, m1, m2, assignment, semester, total, grade, credits: 3
                    });
                }
            }

            gradeDoc.updatedAt = Date.now();
            await gradeDoc.save();
        }

        console.log('Successfully added random marks for 5 subjects to up to 40 1st year students');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedGrades();
