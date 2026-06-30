import axios from 'axios';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your backend API URL
  headers: {
    'Content-Type': 'application/json', // You can customize this if necessary
  },
});

export default axiosInstance;
