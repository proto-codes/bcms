import axios from 'axios';

// Set the baseURL for all requests
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',  // Your Laravel backend URL
  withCredentials: true,  // Needed for session-based authentication with Sanctum
});

// Function to set CSRF token
const setCSRFToken = async () => {
  try {
    // Request the CSRF cookie using the axios instance
    await axiosInstance.get('/sanctum/csrf-cookie');

    // Get CSRF token from the response of your csrf-token route
    const response = await axiosInstance.get('/csrf-token');
    axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data.csrf_token; // Set the CSRF token in the headers
    console.log('CSRF token set:', response.data.csrf_token);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

// Call the function to set the CSRF token when the app initializes
setCSRFToken();

export default axiosInstance;
