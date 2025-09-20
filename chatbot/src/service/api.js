import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_RENDER_URL || "http://localhost:8000",
  
  withCredentials: true,
});

export default api;
// Deployment fix - Sun Sep 21 03:15:58 IST 2025
