import apiClient from './api';

const timetableService = {
    // Get all timetable slots
    getTimetables: async (isAdmin = false) => {
        const res = await apiClient.get("/timetables");
        const allSlots = res.data || [];

        if (isAdmin) {
            return allSlots;
        }

        const facultyId = localStorage.getItem('facultyId');
        const facultyName = localStorage.getItem('facultyName');

        return allSlots.filter(slot =>
            (facultyId && slot.facultyId === facultyId) ||
            (facultyName && slot.faculty === facultyName)
        );
    },

    // Add a new slot
    addSlot: async (slotData) => {
        // Ensure all required fields for backend are present
        const payload = {
            ...slotData,
            section: slotData.section || "N/A" // Fallback if still missing
        };
        const res = await apiClient.post("/timetables", payload);
        return res.data;
    },

    // Update a slot
    updateSlot: async (id, slotData) => {
        const res = await apiClient.put(`/timetables/${id}`, slotData);
        return res.data;
    },

    // Delete a slot
    deleteSlot: async (id) => {
        const res = await apiClient.delete(`/timetables/${id}`);
        return res.data;
    }
};

export default timetableService;
