import axios from 'axios';

// The URL of your running backend server
const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

// Helper for services that were using the mockCall pattern
export const mockCall = async (data, url, method = 'GET') => {
    // If no URL is provided, just return the data as it's likely a temporary mock
    if (!url) {
        return new Promise(resolve => setTimeout(() => resolve(data), 200));
    }

    try {
        const response = await apiClient({
            method: method,
            url: url,
            data: data
        });
        return response.data;
    } catch (error) {
        console.error(`API Call Error (${url}):`, error);
        throw error; // DON'T FALLBACK - THROW ERROR SO UI KNOWS IT FAILED
    }
};

export default apiClient;
