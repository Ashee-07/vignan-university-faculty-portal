import apiClient from './api';

const progressService = {
    // Get tracked courses
    getTrackedCourses: async () => {
        const facultyOid = localStorage.getItem('facultyOid');

        try {
            const res = await apiClient.get(`/faculty/${facultyOid}`);
            const assignments = res.data.assignedSubjects || [];

            return assignments.map((a, index) => ({
                id: a.subject.substring(0, 6).toUpperCase(), // Simulating code
                name: `[${a.year} Year] ${a.subject}`,
                year: a.year
            }));
        } catch (err) {
            console.error("Failed to fetch courses for progress tracking", err);
            return [];
        }
    },

    // Get course progress
    getCourseProgress: async (courseNameWithYear) => {
        const department = localStorage.getItem('facultyDepartment');
        const yearMatch = courseNameWithYear.match(/\[(.*?) Year\]/);
        const year = yearMatch ? yearMatch[1] : '3rd';

        try {
            const res = await apiClient.get(`/students?department=${department}&year=${year}`);

            return res.data.map(student => ({
                id: student.regNo || student.rollNo,
                name: student.name,
                attendance: student.attendance || 0,
                assignments: student.marks?.asgn || 0,
                exams: student.marks?.m1 || 0,
                overall: Math.floor(((student.attendance || 0) * 0.3) + ((student.marks?.asgn || 0) * 2) + ((student.marks?.m1 || 0) * 0.5))
            }));
        } catch (err) {
            console.error("Failed to fetch students for progress", err);
            return [];
        }
    }
};

export default progressService;
