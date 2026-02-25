import apiClient from './api';

const reportService = {
    // Get list of courses available for reports
    getReportCourses: async () => {
        const facultyOid = localStorage.getItem('facultyOid');

        try {
            const res = await apiClient.get(`/faculty/${facultyOid}`);
            const assignments = res.data.assignedSubjects || [];

            return assignments.map((subj, idx) => ({
                id: subj.subject.substring(0, 3).toUpperCase() + (100 + idx),
                name: subj.subject
            }));
        } catch (err) {
            console.error("Failed to fetch courses for reports", err);
            return [];
        }
    },

    // Generate a report
    generateReport: async (reportType, courseId) => {
        let endpoint = "";
        if (reportType === "Attendance Report") {
            endpoint = `/reports/pdf?course=${courseId}`;
        } else {
            endpoint = `/reports/excel?course=${courseId}`;
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
