import axios from 'axios';

// Create an instance of Axios with default settings
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Your API base URL
    timeout: 10000, // Request timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Add the token to the Authorization header
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