import apiClient from './api';

const facultyService = {
    // Get all faculty
    getFaculty: async () => {
        const res = await apiClient.get("/faculty");
        return res.data;
    },

    // Get single faculty by ID
    getFacultyById: async (id) => {
        const res = await apiClient.get(`/faculty/${id}`);
        return res.data;
    },

    // Add a single faculty
    addFaculty: async (faculty) => {
        const res = await apiClient.post("/faculty", faculty);
        return res.data;
    },

    // Update faculty assignments
    updateFacultyAssignments: async (facultyId, assignments) => {
        const res = await apiClient.put(`/faculty/${facultyId}`, { assignments });
        return res.data;
    },

    // Change password
    changePassword: async (facultyId, currentPassword, newPassword) => {
        const res = await apiClient.put(`/faculty/change-password/${facultyId}`, { currentPassword, newPassword });
        return res.data;
    }
};

// Available options for Admin UI
export const AVAILABLE_SUBJECTS = [
    'Python Foundations', 'Data Structures', 'Operating Systems',
    'DBMS', 'Cloud Computing', 'AI & Machine Learning',
    'Software Engineering', 'Computer Networks', 'Web Technologies'
];

export const AVAILABLE_YEARS = ['1st', '2nd', '3rd', '4th'];

export default facultyService;
