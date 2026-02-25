import apiClient from './api';

const assessmentService = {
    // Get all assessments
    getAssessments: async () => {
        const res = await apiClient.get('/assessments');
        return res.data;
    },

    // Create new assessment
    createAssessment: async (assessmentData) => {
        const res = await apiClient.post('/assessments', assessmentData);
        return res.data;
    },

    // Update assessment
    updateAssessment: async (id, assessmentData) => {
        const res = await apiClient.put(`/assessments/${id}`, assessmentData);
        return res.data;
    },

    // Delete assessment
    deleteAssessment: async (id) => {
        const res = await apiClient.delete(`/assessments/${id}`);
        return res.data;
    },

    // Get assessments for a specific year (for students)
    getAssessmentsByYear: async (year) => {
        const res = await apiClient.get(`/assessments?year=${year}`);
        return res.data;
    }
};

export default assessmentService;
