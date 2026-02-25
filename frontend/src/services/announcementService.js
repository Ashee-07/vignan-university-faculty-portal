import apiClient, { mockCall } from './api';

const announcementService = {
    // Get all announcements
    getAnnouncements: async () => {
        return mockCall([], '/announcements', 'GET');
    },

    // Post new announcement
    postAnnouncement: async (announcementData, authorRole = 'Faculty') => {
        const payload = {
            ...announcementData,
            date: new Date().toISOString(),
            author: authorRole === 'Admin' ? 'Department Admin' : 'Faculty Member'
        };
        return mockCall(payload, '/announcements', 'POST');
    },

    // Delete announcement
    deleteAnnouncement: async (id) => {
        return mockCall({ success: true }, `/announcements/${id}`, 'DELETE');
    }
};

export default announcementService;
