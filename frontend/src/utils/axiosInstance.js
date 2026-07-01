import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json', // You can customize this if necessary
  },
});

export default axiosInstance;
