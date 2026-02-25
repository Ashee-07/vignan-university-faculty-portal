const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');
const Timetable = require('../models/Timetable');
const Admin = require('../models/Admin');
const Grade = require('../models/Grade');

dotenv.config({ path: './backend/.env' });

// --- Configuration ---
const DEPARTMENTS = ['IT']; // Focusing on IT as per request
const SECTIONS = ['A']; // User said "not have any sections", so we default to 'A'
const STUDENTS_PER_YEAR = 40;

// Subjects Config (6 per year)
const SUBJECTS = {
    '1st': [
        'Mathematics I', 'Engineering Physics', 'Problem Solving with C',
        'Engineering Graphics', 'Technical English', 'Environmental Science'
    ],
    '2nd': [
        'Data Structures', 'Digital Logic Design', 'Java Programming',
        'Discrete Mathematics', 'Computer Organization', 'Python Programming'
    ],
    '3rd': [
        'Database Management Systems', 'Operating Systems', 'Computer Networks',
        'Web Technologies', 'Software Engineering', 'Automata Theory'
    ],
    '4th': [
        'Artificial Intelligence', 'Machine Learning', 'Cloud Computing',
        'Information Security', 'Big Data Analytics', 'Project Work'
    ]
};

// Faculty Data (mapped to subjects)
const FACULTY_DATA = [
    {
        facultyId: 'FAC001', name: 'Dr. A. Smith', email: 'smith@vignan.ac.in', subjects: [
            { s: 'Mathematics I', y: '1st' }, { s: 'Discrete Mathematics', y: '2nd' }
        ]
    },
    {
        facultyId: 'FAC002', name: 'Prof. B. Jones', email: 'jones@vignan.ac.in', subjects: [
            { s: 'Engineering Physics', y: '1st' }, { s: 'Digital Logic Design', y: '2nd' }
        ]
    },
    {
        facultyId: 'FAC003', name: 'Dr. C. Davis', email: 'davis@vignan.ac.in', subjects: [
            { s: 'Problem Solving with C', y: '1st' }, { s: 'Data Structures', y: '2nd' }
        ]
    },
    {
        facultyId: 'FAC004', name: 'Ms. D. Wilson', email: 'wilson@vignan.ac.in', subjects: [
            { s: 'Java Programming', y: '2nd' }, { s: 'Web Technologies', y: '3rd' }
        ]
    },
    {
        facultyId: 'FAC005', name: 'Mr. E. Brown', email: 'brown@vignan.ac.in', subjects: [
            { s: 'Engineering Graphics', y: '1st' }, { s: 'Computer Organization', y: '2nd' }
        ]
    },
    {
        facultyId: 'FAC006', name: 'Dr. F. Miller', email: 'miller@vignan.ac.in', subjects: [
            { s: 'Database Management Systems', y: '3rd' }, { s: 'Big Data Analytics', y: '4th' }
        ]
    },
    {
        facultyId: 'FAC007', name: 'Prof. G. Taylor', email: 'taylor@vignan.ac.in', subjects: [
            { s: 'Operating Systems', y: '3rd' }, { s: 'Cloud Computing', y: '4th' }
        ]
    },
    {
        facultyId: 'FAC008', name: 'Dr. H. Anderson', email: 'anderson@vignan.ac.in', subjects: [
            { s: 'Computer Networks', y: '3rd' }, { s: 'Information Security', y: '4th' }
        ]
    },
    {
        facultyId: 'FAC009', name: 'Ms. I. Thomas', email: 'thomas@vignan.ac.in', subjects: [
            { s: 'Software Engineering', y: '3rd' }, { s: 'Project Work', y: '4th' }
        ]
    },
    {
        facultyId: 'FAC010', name: 'Dr. J. Jackson', email: 'jackson@vignan.ac.in', subjects: [
            { s: 'Artificial Intelligence', y: '4th' }, { s: 'Machine Learning', y: '4th' }
        ]
    },
    {
        facultyId: 'FAC011', name: 'Mr. K. White', email: 'white@vignan.ac.in', subjects: [
            { s: 'Python Programming', y: '2nd' }, { s: 'Automata Theory', y: '3rd' }
        ]
    },
    {
        facultyId: 'FAC012', name: 'Ms. L. Harris', email: 'harris@vignan.ac.in', subjects: [
            { s: 'Technical English', y: '1st' }, { s: 'Environmental Science', y: '1st' }
        ]
    }
];

// Helper to find faculty for subject
const findFacultyForSubject = (subject) => {
    const fac = FACULTY_DATA.find(f => f.subjects.some(s => s.s === subject));
    return fac || FACULTY_DATA[0]; // Fallback
};

const generateStudents = () => {
    const students = [];
    // 1st Year (251 series)
    for (let i = 1; i <= STUDENTS_PER_YEAR; i++) {
        students.push({
            regNo: `251FA07${i.toString().padStart(3, '0')}`,
            name: `Student 1-${i}`,
            department: 'IT', year: '1st', section: 'A',
            password: 'password123', email: `251fa07${i.toString().padStart(3, '0')}@vignan.ac.in`
        });
    }
    // 2nd Year (241 series)
    for (let i = 1; i <= STUDENTS_PER_YEAR; i++) {
        students.push({
            regNo: `241FA07${i.toString().padStart(3, '0')}`,
            name: `Student 2-${i}`,
            department: 'IT', year: '2nd', section: 'A',
            password: 'password123', email: `241fa07${i.toString().padStart(3, '0')}@vignan.ac.in`
        });
    }
    // 3rd Year (231 series)
    for (let i = 1; i <= STUDENTS_PER_YEAR; i++) {
        students.push({
            regNo: `231FA07${i.toString().padStart(3, '0')}`,
            name: `Student 3-${i}`,
            department: 'IT', year: '3rd', section: 'A',
            password: 'password123', email: `231fa07${i.toString().padStart(3, '0')}@vignan.ac.in`
        });
    }
    // 4th Year (221 series)
    for (let i = 1; i <= STUDENTS_PER_YEAR; i++) {
        students.push({
            regNo: `221FA07${i.toString().padStart(3, '0')}`,
            name: `Student 4-${i}`,
            department: 'IT', year: '4th', section: 'A',
            password: 'password123', email: `221fa07${i.toString().padStart(3, '0')}@vignan.ac.in`
        });
    }
    return students;
};

const generateTimetable = () => {
    const timetable = [];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = [
        '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM',
        '01:00 PM - 02:00 PM', '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM'
    ];
    const years = ['1st', '2nd', '3rd', '4th'];

    years.forEach(year => {
        const subjects = SUBJECTS[year];
        let subjectIndex = 0;

        days.forEach(day => {
            times.forEach(time => {
                // Ensure we don't schedule lunch break or empty slots for simplicity, or just fill them
                if (subjectIndex >= subjects.length) subjectIndex = 0;

                const subject = subjects[subjectIndex];
                const faculty = findFacultyForSubject(subject);

                timetable.push({
                    facultyId: faculty.facultyId,
                    faculty: faculty.name,
                    day: day,
                    time: time,
                    subject: subject,
                    year: year,
                    section: 'A',
                    room: `LH-${year.charAt(0)}0${Math.floor(Math.random() * 5) + 1}`,
                    type: 'Lecture'
                });

                subjectIndex++;
            });
        });
    });
    return timetable;
};

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing data
        await Promise.all([
            Faculty.deleteMany({}),
            Student.deleteMany({}),
            Timetable.deleteMany({}),
            Admin.deleteMany({}),
            Grade.deleteMany({})
        ]);
        console.log('🗑️  Cleared existing data...');

        // 1. Create Admin
        await Admin.create({
            adminId: 'admin',
            password: 'password123',
            department: 'IT',
            name: 'System Administrator'
        });

        // 2. Create Faculty
        const facultyDocs = FACULTY_DATA.map(f => ({
            facultyId: f.facultyId,
            name: f.name,
            department: 'IT', // Defaulting to IT
            email: f.email,
            password: 'password123',
            assignedSubjects: f.subjects.map(s => ({ subject: s.s, year: s.y }))
        }));
        await Faculty.insertMany(facultyDocs);
        console.log(`👨‍🏫 Created ${facultyDocs.length} faculty members`);

        // 3. Create Students
        const studentDocs = generateStudents();
        await Student.insertMany(studentDocs);
        console.log(`🎓 Created ${studentDocs.length} students (40 per year)`);

        // 4. Create Timetables
        const timetableDocs = generateTimetable();
        await Timetable.insertMany(timetableDocs);
        console.log(`📅 Created ${timetableDocs.length} timetable entries`);

        console.log('✨ Database Seeded Successfully!');
        process.exit();
    } catch (err) {
        console.error('❌ Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
