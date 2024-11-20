import axios from 'axios';

// Create an instance of Axios with default settings
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your API base URL
    withCredentials: true,
    timeout: 10000, // Request timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the accessToken to every request
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken'); // Get accessToken from localStorage
    if (accessToken) {
        config.headers = {
            ...config.headers, // Preserve existing headers
            Authorization: `Bearer ${accessToken}`,
        };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for handling errors globally
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
});

export default api;