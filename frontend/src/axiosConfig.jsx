import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // locall
  // baseURL: 'http://3.27.122.218:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
