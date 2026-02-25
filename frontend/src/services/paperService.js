import apiClient from './api';

const paperService = {
    // Get all question papers
    getPapers: async (filters = {}) => {
        const query = new URLSearchParams(filters).toString();
        const res = await apiClient.get(`/questionPapers?${query}`);
        return res.data;
    },

    // Upload a new paper
    uploadPaper: async (paperData) => {
        const formData = new FormData();
        for (const key in paperData) {
            formData.append(key, paperData[key]);
        }

        const res = await apiClient.post('/questionPapers', formData);
        return res.data;
    },

    // Delete a paper
    deletePaper: async (id) => {
        const res = await apiClient.delete(`/questionPapers/${id}`);
        return res.data;
    }
};

export default paperService;
