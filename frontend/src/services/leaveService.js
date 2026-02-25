import apiClient from './api';

const leaveService = {
    // Get leave requests for the current faculty
    getLeaveRequests: async (facultyId) => {
        const res = await apiClient.get(`/leave/faculty/${facultyId}`);
        return res.data;
    },

    // Apply for new leave
    applyLeave: async (leaveData) => {
        const res = await apiClient.post('/leave/apply', leaveData);
        return res.data;
    },

    // Get leave balance (Mocked for now as there's no Backend model for balance yet, but calling hypothetical endpoint)
    getLeaveBalance: async (facultyId) => {
        // Fallback to static if backend isn't ready for balance, but trying API first
        try {
            const res = await apiClient.get(`/leave/balance/${facultyId}`);
            return res.data;
        } catch (e) {
            return { sick: 10, casual: 12, vacation: 20 };
        }
    },

    // ADMIN: Get all leave requests for the department
    getAllLeaveRequests: async () => {
        const res = await apiClient.get('/leave/admin/all');
        return res.data;
    },

    // ADMIN: Update leave status (Approve/Reject)
    updateLeaveStatus: async (leaveId, status) => {
        const res = await apiClient.put(`/leave/admin/status/${leaveId}`, { status });
        return res.data;
    }
};

export default leaveService;
