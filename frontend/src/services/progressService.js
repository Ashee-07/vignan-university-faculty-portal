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
        const subjectName = courseNameWithYear.split('] ')[1] || courseNameWithYear;

        try {
            // Fetch students with their grades
            const res = await apiClient.get(`/grades/class/${year}/${department}`);
            const studentsWithGrades = res.data;

            // Fetch all attendance (ideally this would be a specific backend route)
            const attRes = await apiClient.get('/attendance');
            const allAttendance = attRes.data.filter(a => (a.subjectId?.name || a.subject) === subjectName);

            return studentsWithGrades.map(student => {
                // Find subject grades for this student
                const subjectGrades = student.grades?.find(g => g.subject === subjectName) || {};
                
                // Calculate attendance
                let totalClasses = allAttendance.length;
                let presentClasses = 0;
                
                allAttendance.forEach(record => {
                    const studentRecord = record.students.find(s => s.regNo === student.regNo);
                    if (studentRecord && studentRecord.status === 'Present') {
                        presentClasses++;
                    }
                });

                const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
                const assignments = subjectGrades.assignment || 0;
                const exams = subjectGrades.m1 || 0; // Using mid1 as a proxy for exams %
                const examsPercentage = exams > 0 ? Math.round((exams / 25) * 100) : 0; // m1 is out of 25
                
                // Calculate overall based on the real total marks (out of 200)
                const totalMarks = subjectGrades.total || 0;
                const overall = Math.round((totalMarks / 200) * 100);

                return {
                    id: student.regNo,
                    name: student.name,
                    attendance: attendancePercentage,
                    assignments: assignments,
                    exams: examsPercentage,
                    overall: overall,
                    grade: subjectGrades.grade || 'F'
                };
            });
        } catch (err) {
            console.error("Failed to fetch students for progress", err);
            return [];
        }
    }
};

export default progressService;
