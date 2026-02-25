import apiClient from './api';

const gradeService = {
    // Get courses for grading
    getCourses: async () => {
        const facultyOid = localStorage.getItem('facultyOid');

        try {
            const res = await apiClient.get(`/faculty/${facultyOid}`);
            const assignments = res.data.assignedSubjects || [];

            return assignments.map((a, index) => ({
                id: index + 1,
                name: `[${a.year} Year] ${a.subject}`,
                year: a.year,
                subject: a.subject
            }));
        } catch (err) {
            console.error("Failed to fetch courses for grading", err);
            return [];
        }
    },

    // Get students for a course
    getStudents: async (year, subject) => {
        const department = localStorage.getItem('facultyDepartment');

        try {
            // Fetch students AND their grades from the new Grade collection endpoint
            // The backend endpoint is: GET /api/grades/class/:year/:department
            const res = await apiClient.get(`/grades/class/${year}/${department}`);

            // The backend returns an array of objects: { regNo, name, grades: [...] }
            return res.data.map(student => {
                // Find the grade object for the specific subject requested
                const gradeData = student.grades?.find(g => g.subject === subject) || {};

                return {
                    id: student.regNo,
                    name: student.name,
                    midterm1: gradeData.m1 || '',
                    midterm2: gradeData.m2 || '',
                    semester: gradeData.semester || '',
                    assignment: gradeData.assignment || '',
                    total: gradeData.total || 0,
                    grade: gradeData.grade || '-'
                };
            });
        } catch (err) {
            console.error("Failed to fetch students for grading", err);
            return [];
        }
    },

    // Save grades for a student
    saveGrade: async (data) => {
        return await apiClient.post('/grades', data);
    },

    // Get grades for a single student (for Student Portal)
    getStudentGrades: async (regNo) => {
        const res = await apiClient.get(`/grades/${regNo}`);
        return res.data.grades;
    }
};

const calculateGrade = (total) => {
    const percentage = (total / 200) * 100;
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    return 'F';
};

export default gradeService;
