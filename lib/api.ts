import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ← Dùng biến môi trường
  withCredentials: true,
});

export default API;
