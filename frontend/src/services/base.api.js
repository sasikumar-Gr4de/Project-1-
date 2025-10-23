import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // const originalRequest = error.config;
    if (error.response?.status === 401) {
      // Unathorized
      localStorage.rremoveItem(auth - token);
      window.location.href = "/login";
    }
    if (error.response?.status === 403) {
      window.location.href = "/unahthorized";
    }

    return Promise.reject(error);
  }
);

export default api;
