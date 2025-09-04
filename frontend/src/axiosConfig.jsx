import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // locall
  // baseURL: 'http://3.25.59.62:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
