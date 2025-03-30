import axios from 'axios';

const LOCAL_IP = '192.168.1.12'; // Địa chỉ IP cục bộ của bạn
const API_BASE_URL = `http://${LOCAL_IP}:3000/api/`;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosClient;
