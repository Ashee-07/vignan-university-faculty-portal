
// Mock Database Service for LocalStorage Persistence
const SEED_DATA = {
    faculty: [
        { _id: '1', facultyId: 'FAC001', name: 'Dr. Rajesh Kumar', department: 'IT', email: 'rajesh@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Cloud Computing', year: '3rd' }, { subject: 'DBMS', year: '3rd' }, { subject: 'Python Foundations', year: '1st' }] },
        { _id: '2', facultyId: 'FAC002', name: 'Prof. Sarah Williams', department: 'IT', email: 'sarah@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Operating Systems', year: '2nd' }, { subject: 'Data Structures', year: '2nd' }] },
        { _id: '3', facultyId: 'FAC003', name: 'Dr. John Doe', department: 'CSE', email: 'john@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Artificial Intelligence', year: '4th' }, { subject: 'Machine Learning', year: '4th' }] },
        { _id: '4', facultyId: 'FAC004', name: 'Ms. Emily Davis', department: 'ECE', email: 'emily@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Signal Processing', year: '2nd' }, { subject: 'Digital Circuits', year: '2nd' }] },
        { _id: '5', facultyId: 'FAC005', name: 'Dr. Michael Brown', department: 'CSE', email: 'michael@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Computer Networks', year: '3rd' }, { subject: 'Network Security', year: '4th' }] },
        { _id: '6', facultyId: 'FAC006', name: 'Dr. Anjali Sharma', department: 'IT', email: 'anjali@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Web Technologies', year: '3rd' }] },
        { _id: '7', facultyId: 'FAC007', name: 'Prof. Robert Frost', department: 'English', email: 'robert@vignan.ac.in', password: 'password123', assignedSubjects: [{ subject: 'Professional English', year: '1st' }] }
    ],
    students: [
        // 1st Year
        { _id: 's1', regNo: '251FA07001', name: 'Alex Johnson', department: 'IT', year: '1st', section: 'A', password: 'password123' },
        { _id: 's2', regNo: '251FA07002', name: 'Bella Thorne', department: 'CSE', year: '1st', section: 'B', password: 'password123' },
        { _id: 's3', regNo: '251FA07003', name: 'Charlie Puth', department: 'ECE', year: '1st', section: 'A', password: 'password123' },
        // 2nd Year
        { _id: 's4', regNo: '241FA07001', name: 'David Miller', department: 'IT', year: '2nd', section: 'A', password: 'password123' },
        { _id: 's5', regNo: '241FA07002', name: 'Emma Wilson', department: 'ECE', year: '2nd', section: 'A', password: 'password123' },
        { _id: 's6', regNo: '241FA07003', name: 'Frank Ocean', department: 'CSE', year: '2nd', section: 'B', password: 'password123' },
        // 3rd Year
        { _id: 's7', regNo: '231FA07001', name: 'Grace Hopper', department: 'IT', year: '3rd', section: 'A', password: 'password123' },
        { _id: 's8', regNo: '231FA07002', name: 'Henry Ford', department: 'CSE', year: '3rd', section: 'B', password: 'password123' },
        { _id: 's9', regNo: '231FA07003', name: 'Ian Wright', department: 'IT', year: '3rd', section: 'A', password: 'password123' },
        // 4th Year
        { _id: 's10', regNo: '221FA07001', name: 'Jack Ma', department: 'IT', year: '4th', section: 'A', password: 'password123' },
        { _id: 's11', regNo: '221FA07002', name: 'Kelly Clarkson', department: 'ECE', year: '4th', section: 'B', password: 'password123' },
        { _id: 's12', regNo: '221FA07003', name: 'Linus Torvalds', department: 'CSE', year: '4th', section: 'A', password: 'password123' }
    ],
    timetables: [
        // 1st Year (4 Slots)
        { _id: 't1', facultyId: 'FAC001', faculty: 'Dr. Rajesh Kumar', day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Python Foundations', year: '1st', section: 'A', room: 'LH-001', type: 'Lecture' },
        { _id: 't2', facultyId: 'FAC007', faculty: 'Prof. Robert Frost', day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Professional English', year: '1st', section: 'A', room: 'LH-002', type: 'Lecture' },
        { _id: 't3', facultyId: 'FAC001', faculty: 'Dr. Rajesh Kumar', day: 'Tuesday', time: '11:00 AM - 12:00 PM', subject: 'Python Foundations', year: '1st', section: 'A', room: 'LH-001', type: 'Practical' },
        { _id: 't4', facultyId: 'FAC007', faculty: 'Prof. Robert Frost', day: 'Wednesday', time: '02:00 PM - 03:00 PM', subject: 'Professional English', year: '1st', section: 'A', room: 'LH-002', type: 'Tutorial' },

        // 2nd Year (4 Slots)
        { _id: 't5', facultyId: 'FAC002', faculty: 'Prof. Sarah Williams', day: 'Monday', time: '09:00 AM - 10:00 AM', subject: 'Data Structures', year: '2nd', section: 'A', room: 'LH-201', type: 'Lecture' },
        { _id: 't6', facultyId: 'FAC004', faculty: 'Ms. Emily Davis', day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Digital Circuits', year: '2nd', section: 'A', room: 'LH-205', type: 'Lecture' },
        { _id: 't7', facultyId: 'FAC002', faculty: 'Prof. Sarah Williams', day: 'Tuesday', time: '10:00 AM - 11:00 AM', subject: 'Operating Systems', year: '2nd', section: 'A', room: 'LH-201', type: 'Lecture' },
        { _id: 't8', facultyId: 'FAC004', faculty: 'Ms. Emily Davis', day: 'Wednesday', time: '09:00 AM - 10:00 AM', subject: 'Signal Processing', year: '2nd', section: 'A', room: 'LH-206', type: 'Practical' },

        // 3rd Year (4 Slots)
        { _id: 't9', facultyId: 'FAC001', faculty: 'Dr. Rajesh Kumar', day: 'Monday', time: '10:00 AM - 11:00 AM', subject: 'Cloud Computing', year: '3rd', section: 'A', room: 'LH-301', type: 'Lecture' },
        { _id: 't10', facultyId: 'FAC005', faculty: 'Dr. Michael Brown', day: 'Monday', time: '01:00 PM - 02:00 PM', subject: 'Computer Networks', year: '3rd', section: 'A', room: 'LH-302', type: 'Lecture' },
        { _id: 't11', facultyId: 'FAC006', faculty: 'Dr. Anjali Sharma', day: 'Tuesday', time: '09:00 AM - 10:00 AM', subject: 'Web Technologies', year: '3rd', section: 'A', room: 'LH-305', type: 'Practical' },
        { _id: 't12', facultyId: 'FAC001', faculty: 'Dr. Rajesh Kumar', day: 'Wednesday', time: '11:00 AM - 12:00 PM', subject: 'DBMS', year: '3rd', section: 'A', room: 'LH-301', type: 'Lecture' },

        // 4th Year (4 Slots)
        { _id: 't13', facultyId: 'FAC003', faculty: 'Dr. John Doe', day: 'Monday', time: '11:00 AM - 12:00 PM', subject: 'Artificial Intelligence', year: '4th', section: 'A', room: 'LH-401', type: 'Lecture' },
        { _id: 't14', facultyId: 'FAC005', faculty: 'Dr. Michael Brown', day: 'Monday', time: '02:00 PM - 03:00 PM', subject: 'Network Security', year: '4th', section: 'A', room: 'LH-402', type: 'Lecture' },
        { _id: 't15', facultyId: 'FAC003', faculty: 'Dr. John Doe', day: 'Tuesday', time: '01:00 PM - 02:00 PM', subject: 'Machine Learning', year: '4th', section: 'A', room: 'LH-401', type: 'Practical' },
        { _id: 't16', facultyId: 'FAC003', faculty: 'Dr. John Doe', day: 'Thursday', time: '09:00 AM - 10:00 AM', subject: 'Artificial Intelligence', year: '4th', section: 'A', room: 'LH-401', type: 'Tutorial' }
    ],
    assessments: [],
    announcements: [],
    reports: [],
    assignments: [],
    materials: [],
    questionPapers: [],
    attendance: []
};

// Initialize DB
const initDB = () => {
    // Check for a new version key to force update if schema changes
    const DB_VERSION = 'vignan_db_v12_mega_seed';

    if (!localStorage.getItem(DB_VERSION)) {
        // Clear old data to ensure clean state for new mock data
        console.log('Detecting new DB version, reseeding data...');

        // Seed new data
        Object.keys(SEED_DATA).forEach(key => {
            localStorage.setItem(key, JSON.stringify(SEED_DATA[key]));
        });

        localStorage.setItem(DB_VERSION, 'true');
        console.log('Mock DB Re-Initialized with Extended Seed Data');
    }
};

// Helper helpers
const getCollection = (collection) => {
    const data = localStorage.getItem(collection);
    return data ? JSON.parse(data) : [];
};

const saveCollection = (collection, data) => {
    localStorage.setItem(collection, JSON.stringify(data));
};

const mockDB = {
    init: initDB,

    get: (collection) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = getCollection(collection);
                resolve({ data });
            }, 300);
        });
    },

    getOne: (collection, id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const list = getCollection(collection);
                const item = list.find(i => i._id === id || i.id === id);
                resolve({ data: item });
            }, 200);
        });
    },

    post: (collection, item) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const list = getCollection(collection);
                const newItem = { ...item, _id: Date.now().toString(), id: Date.now().toString() };
                list.push(newItem);
                saveCollection(collection, list);
                resolve({ data: newItem });
            }, 400);
        });
    },

    put: (collection, id, updates) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const list = getCollection(collection);
                const index = list.findIndex(i => i._id === id || i.id === id);
                if (index !== -1) {
                    list[index] = { ...list[index], ...updates };
                    saveCollection(collection, list);
                    resolve({ data: list[index] });
                } else {
                    resolve({ data: null });
                }
            }, 300);
        });
    },

    delete: (collection, id) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const list = getCollection(collection);
                const newList = list.filter(i => i._id !== id && i.id !== id);
                saveCollection(collection, newList);
                resolve({ data: { success: true } });
            }, 300);
        });
    }
};

// Auto-init on load
initDB();

export default mockDB;
