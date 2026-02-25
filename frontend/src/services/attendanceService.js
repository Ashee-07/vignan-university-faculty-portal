import apiClient, { mockCall } from './api';

const attendanceService = {
    // Get all classes for attendance marking
    getClasses: async () => {
        const facultyId = localStorage.getItem('facultyId');
        const facultyOid = localStorage.getItem('facultyOid');

        // 1. Fetch faculty profile for assignments
        let combined = [];
        try {
            const profileRes = await apiClient.get(`/faculty/${facultyOid}`);
            combined = [...(profileRes.data.assignedSubjects || [])];
        } catch (err) {
            console.error("Failed to fetch faculty assignments", err);
        }

        // 2. Fetch timetable slots for this faculty
        try {
            const timetableRes = await apiClient.get(`/timetables/faculty/${facultyId}`);
            const slots = timetableRes.data || [];
            slots.forEach(slot => {
                const alreadyExists = combined.some(a => a.subject === slot.subject && a.year === slot.year);
                if (!alreadyExists) {
                    combined.push({ subject: slot.subject, year: slot.year });
                }
            });
        } catch (err) {
            console.error("Failed to fetch timetable for attendance", err);
        }

        // Generate class list
        const classes = combined.map((a, index) => ({
            id: index + 1,
            course: a.subject,
            time: "09:00 AM", // Defaults
            room: "LH-101",
            strength: 30,
            year: a.year
        }));

        return classes;
    },

    // Get students for a specific class
    getStudentsForClass: async (classData) => {
        const facultyOid = localStorage.getItem('facultyOid');
        let department = 'IT'; // Default fallback

        try {
            // First fetch faculty profile to get their official department
            const profileRes = await apiClient.get(`/faculty/${facultyOid}`);
            department = profileRes.data.department || 'IT';

            const year = classData.year || '3rd';

            // Fetch filtered students directly from MongoDB
            const res = await apiClient.get(`/students?department=${department}&year=${year}`);

            return res.data.map(student => ({
                id: student.regNo || student.rollNo,
                name: student.name,
                rollNo: student.regNo || student.rollNo,
                status: 'present',
                attendance: student.attendance || "85%",
                feeStatus: student.feeStatus || 'full'
            }));
        } catch (err) {
            console.error("Failed to fetch students for class", err);
            return [];
        }
    },

    // Save/Mark attendance for a class
    saveAttendance: async (attendanceData) => {
        const payload = {
            facultyId: localStorage.getItem('facultyId'),
            subject: attendanceData.classId || attendanceData.course, // Adjusted based on Model
            date: attendanceData.date,
            year: attendanceData.year || '3rd',
            section: 'A', // Assuming section for now
            period: attendanceData.period || '1', // Include period field
            students: Object.keys(attendanceData.records).map(regNo => ({
                regNo: regNo,
                status: attendanceData.records[regNo]
            }))
        };

        const res = await apiClient.post("/attendance", payload);
        return res.data;
    },

    // Get attendance history
    getAttendanceHistory: async (classId) => {
        // This will now call the real backend
        const res = await apiClient.get(`/attendance`);
        const allHistory = res.data || [];
        // Filter for specific subject if needed
        return allHistory.filter(h => h.subject === classId).map(h => ({
            date: h.date,
            present: h.students.filter(s => s.status === 'Present').length,
            total: h.students.length,
            percentage: Math.round((h.students.filter(s => s.status === 'Present').length / h.students.length) * 100)
        }));
    },

    // Get attendance for a specific student
    getStudentAttendance: async (regNo) => {
        const res = await apiClient.get(`/attendance/student/${regNo}`);
        return res.data;
    }
};

export default attendanceService;
