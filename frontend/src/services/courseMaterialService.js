import apiClient from './api';

const courseMaterialService = {
    // Get course materials with optional filtering
    getMaterials: async (params) => {
        const res = await apiClient.get('/materials', { params });
        return res.data;
    },

    // Upload new material (supports file upload)
    uploadMaterial: async (materialData) => {
        const formData = new FormData();
        for (const key in materialData) {
            formData.append(key, materialData[key]);
        }

        const res = await apiClient.post('/materials', formData);
        return res.data;
    },

    // Update material
    updateMaterial: async (id, materialData) => {
        const res = await apiClient.put(`/materials/${id}`, materialData);
        return res.data;
    },

    // Delete material
    deleteMaterial: async (id) => {
        const res = await apiClient.delete(`/materials/${id}`);
        return res.data;
    }
};

export default courseMaterialService;
