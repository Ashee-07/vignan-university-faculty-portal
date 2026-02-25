import apiClient from './api';

const assignmentService = {
    // Get all assignments (with optional filters)
    getAssignments: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const res = await apiClient.get(`/assignments?${query}`);
        return res.data;
    },

    // Create a new assignment (supports file upload)
    createAssignment: async (assignmentData) => {
        const formData = new FormData();
        for (const key in assignmentData) {
            formData.append(key, assignmentData[key]);
        }

        const res = await apiClient.post('/assignments', formData);
        return res.data;
    },

    // Update an assignment
    updateAssignment: async (id, assignmentData) => {
        const res = await apiClient.put(`/assignments/${id}`, assignmentData);
        return res.data;
    },

    // Delete an assignment
    deleteAssignment: async (id) => {
        const res = await apiClient.delete(`/assignments/${id}`);
        return res.data;
    },
};

export default assignmentService;
