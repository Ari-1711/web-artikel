import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api', // FIX: Port disesuaikan ke 8085
  withCredentials: true, // PENTING: Agar session cookie JSESSIONID dari Spring Security tetap ikut dikirim
});

export default api;