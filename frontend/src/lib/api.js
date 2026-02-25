import apiClient from '../services/api';

const API = {
  get: async (url) => {
    return apiClient.get(url);
  },
  post: async (url, data) => {
    return apiClient.post(url, data);
  },
  put: async (url, data) => {
    return apiClient.put(url, data);
  },
  delete: async (url) => {
    return apiClient.delete(url);
  },
  // Mock Axios.create
  create: () => API
};

export default API;
