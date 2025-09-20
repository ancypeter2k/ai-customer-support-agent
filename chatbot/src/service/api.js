import axios from "axios";

const baseURL = import.meta.env.VITE_RENDER_URL || "http://localhost:8000";
console.log("API Base URL:", baseURL);
console.log("Environment variables:", import.meta.env);

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export default api;
// Deployment fix - Sun Sep 21 03:15:58 IST 2025
