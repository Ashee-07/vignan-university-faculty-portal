import apiClient, { mockCall } from './api';

const studentService = {
    // Get all students
    getStudents: async () => {
        const res = await apiClient.get("/students");
        return res.data;
    },

    // Add a single student
    addStudent: async (student) => {
        // Ensure regNo is set from rollNo for backend compatibility
        const newStudent = {
            ...student,
            regNo: student.rollNo,
            section: student.section || 'A', // Default section
            password: student.password || 'password123' // Default password
        };
        const res = await apiClient.post("/students", newStudent);
        return res.data;
    },

    // Bulk import via CSV data
    bulkImport: async (students) => {
        const imported = students.map((s) => ({
            ...s,
            regNo: s.rollNo,
            section: s.section || 'A',
            password: s.password || 'password123'
        }));
        // Note: For now, bulk import still calls POST /students per student if not supporting bulk endpoint
        // Alternatively, update backend to support bulk. 
        // For simplicity, we'll map them.
        const results = await Promise.all(imported.map(s => apiClient.post("/students", s)));
        return results;
    },

    // Get single student by registration number
    getStudentByRegNo: async (regNo) => {
        const res = await apiClient.get(`/students/${regNo}`);
        return res.data;
    },

    // Delete a student
    deleteStudent: async (id) => {
        const res = await apiClient.delete(`/students/${id}`);
        return res.data;
    }
};

export default studentService;
