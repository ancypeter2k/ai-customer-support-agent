import axios from "axios";

const api = axios.create({
  baseURL: [process.env.CLIENT_URL, process.env.VERCEL_URL],

  withCredentials: true,
});

export default api;
