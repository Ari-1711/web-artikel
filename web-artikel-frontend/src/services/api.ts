import axios from 'axios';

const api = axios.create({
  // Mengambil langsung dari .env, jika tidak ada baru pakai cadangan port 8085/api
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085/api', 
  withCredentials: true,
});

export default api;