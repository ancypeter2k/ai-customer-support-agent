import axios from "axios";

const api = axios.create({
  baseURL: process.env.RENDER_URL || "http://localhost:8000",
  
  withCredentials: true,
});

export default api;
