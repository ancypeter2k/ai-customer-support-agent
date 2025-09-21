import axios from "axios";

const baseURL = import.meta.env.VITE_RENDER_URL || import.meta.env.RENDER_URL || "http://localhost:8000";
console.log("API Base URL:", baseURL);
console.log("VITE_RENDER_URL:", import.meta.env.VITE_RENDER_URL);
console.log("RENDER_URL:", import.meta.env.RENDER_URL);
console.log("All environment variables:", import.meta.env);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;
// Deployment fix - Sun Sep 21 03:15:58 IST 2025
