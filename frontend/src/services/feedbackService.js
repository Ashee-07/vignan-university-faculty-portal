import apiClient, { mockCall } from './api';

const feedbackService = {
    // Get all feedback summaries
    getFeedbackSummaries: async () => {
        const mockData = [
            { id: 1, course: 'IT201 - Data Structures', avgRating: 4.5, responses: 58, date: '2025-10-30', sentiment: 'Positive' },
            { id: 2, course: 'IT301 - DBMS', avgRating: 4.8, responses: 52, date: '2025-10-28', sentiment: 'Very Positive' },
            { id: 3, course: 'IT205 - Web Development', avgRating: 4.3, responses: 60, date: '2025-10-25', sentiment: 'Nueral' },
        ];

        const result = await mockCall(mockData);
        if (result) return result;

        return apiClient.get('/feedback/summaries');
    },

    // Get detailed feedback for a course
    getDetailedFeedback: async (courseId) => {
        const mockData = [
            { id: 201, comment: 'Excellent teaching style.', rating: 5, date: '2025-10-29' },
            { id: 202, comment: 'Could improve lab timing.', rating: 3, date: '2025-10-28' },
        ];

        const result = await mockCall(mockData);
        if (result) return result;

        return apiClient.get(`/feedback/details/${courseId}`);
    }
};

export default feedbackService;
