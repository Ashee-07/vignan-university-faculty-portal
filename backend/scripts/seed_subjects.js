const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subject = require('../models/Subject');

dotenv.config();

const SUBJECTS_DATA = {
    '1st': [
        { name: 'Mathematics I', code: 'MAT101', credits: 4 },
        { name: 'Engineering Physics', code: 'PHY101', credits: 4 },
        { name: 'Problem Solving with C', code: 'CSE101', credits: 4 },
        { name: 'Engineering Graphics', code: 'ME101', credits: 3 },
        { name: 'Technical English', code: 'ENG101', credits: 3 },
        { name: 'Environmental Science', code: 'ENV101', credits: 2 }
    ],
    '2nd': [
        { name: 'Data Structures', code: 'CSE201', credits: 4 },
        { name: 'Digital Logic Design', code: 'ECE201', credits: 3 },
        { name: 'Java Programming', code: 'CSE202', credits: 4 },
        { name: 'Discrete Mathematics', code: 'MAT201', credits: 4 },
        { name: 'Computer Organization', code: 'CSE203', credits: 3 },
        { name: 'Python Programming', code: 'CSE204', credits: 3 }
    ],
    '3rd': [
        { name: 'Database Management Systems', code: 'CSE301', credits: 4 },
        { name: 'Operating Systems', code: 'CSE302', credits: 4 },
        { name: 'Computer Networks', code: 'CSE303', credits: 4 },
        { name: 'Web Technologies', code: 'CSE304', credits: 4 },
        { name: 'Software Engineering', code: 'CSE305', credits: 3 },
        { name: 'Automata Theory', code: 'CSE306', credits: 3 }
    ],
    '4th': [
        { name: 'Artificial Intelligence', code: 'CSE401', credits: 4 },
        { name: 'Machine Learning', code: 'CSE402', credits: 4 },
        { name: 'Cloud Computing', code: 'CSE403', credits: 3 },
        { name: 'Information Security', code: 'CSE404', credits: 3 },
        { name: 'Big Data Analytics', code: 'CSE405', credits: 3 },
        { name: 'Project Work', code: 'PRJ401', credits: 12 }
    ]
};

const seedSubjects = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB...');

        await Subject.deleteMany({});
        console.log('🗑️ Cleared existing subjects');

        const subjectDocs = [];
        for (const year in SUBJECTS_DATA) {
            SUBJECTS_DATA[year].forEach(sub => {
                subjectDocs.push({
                    name: sub.name,
                    code: sub.code,
                    department: 'IT',
                    year: year,
                    credits: sub.credits
                });
            });
        }

        await Subject.insertMany(subjectDocs);
        console.log(`✨ Seeded ${subjectDocs.length} subjects successfully.`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

seedSubjects();
