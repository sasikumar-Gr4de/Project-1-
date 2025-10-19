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

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration - EXCLUDE refresh endpoint from retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh token - use a separate axios instance to avoid interceptor loop
        const refreshAxios = axios.create({
          baseURL: API_BASE_URL,
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Add current token to refresh request
        const currentToken = localStorage.getItem("auth-token");
        if (currentToken) {
          refreshAxios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${currentToken}`;
        }

        const refreshResponse = await refreshAxios.post("/auth/refresh");
        const newToken = refreshResponse.data.data.token;

        localStorage.setItem("auth-token", newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed:", refreshError);

        localStorage.removeItem("auth-token");
        localStorage.removeItem("auth-user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  }
);

const refreshToken = () => {
  // Use separate instance for refresh to avoid interceptor

  const refreshAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const token = localStorage.getItem("auth-token");
  if (token) {
    refreshAxios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  return refreshAxios.post("/auth/refresh");
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
