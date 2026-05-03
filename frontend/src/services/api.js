import axios from 'axios';

// The URL of your running backend server (Prod vs Dev)
const BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') 
    : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000' 
        : 'https://vignan-university-faculty-portal.onrender.com');

const API_BASE_URL = `${BASE_URL}/api`;

export { BASE_URL, API_BASE_URL };

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
