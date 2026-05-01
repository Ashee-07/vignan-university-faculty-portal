import apiClient from './api';

const reportService = {
    // Get list of courses available for reports
    getReportCourses: async () => {
        const facultyOid = localStorage.getItem('facultyOid');
        const userRole = localStorage.getItem('userRole');

        try {
            if (userRole === 'admin') {
                return [
                    { id: 'CSE101', name: 'Computer Science 101' },
                    { id: 'IT202', name: 'Web Technologies' },
                    { id: 'AI303', name: 'Artificial Intelligence' }
                ];
            }
            const res = await apiClient.get(`/faculty/${facultyOid}`);
            const assignments = res.data.assignedSubjects || [];

            return assignments.map((subj, idx) => ({
                id: subj.subject.substring(0, 3).toUpperCase() + (100 + idx),
                name: subj.subject,
                year: subj.year
            }));
        } catch (err) {
            console.error("Failed to fetch courses for reports", err);
            return [];
        }
    },

    // Generate a report
    generateReport: async (reportType, courseId, year, facultyId = 'all', format = 'subjectwise') => {
        let endpoint = "";
        const params = new URLSearchParams({
            course: courseId,
            year: year,
            facultyId: facultyId,
            format: format
        }).toString();

        if (reportType === "Attendance Report") {
            endpoint = `/reports/pdf?${params}`;
        } else {
            endpoint = `/reports/excel?${params}`;
        }

        return apiClient.get(endpoint, { responseType: 'blob' });
    },

    // ADMIN: Get department-wide analytics
    getDeptAnalytics: async () => {
        const res = await apiClient.get('/reports/admin/analytics');
        return res.data;
    }
};

export default reportService;
