import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    const token = localStorage.getItem("token");
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

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshResponse = await api.post("/auth/refresh");
        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("token", newToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("token");
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

// API methods
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => api.post("/auth/refresh"),
  requestPasswordReset: (email) => api.post("/auth/password-reset", { email }),
};

export const playerAPI = {
  getPlayers: (params) => api.get("/players", { params }),
  getPlayer: (id) => api.get(`/players/${id}`),
  createPlayer: (data) => api.post("/players", data),
  updatePlayer: (id, data) => api.put(`/players/${id}`, data),
  getPlayerPerformance: (id, params) =>
    api.get(`/players/${id}/performance`, { params }),
  getPlayerScore: (id, params) => api.get(`/players/${id}/score`, { params }),
  uploadPlayerImage: (id, formData) =>
    api.post(`/players/${id}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  searchPlayers: (q, limit) =>
    api.get("/players/search", { params: { q, limit } }),
  getPlayerStats: (id) => api.get(`/players/${id}/stats`),
  bulkCreatePlayers: (data) => api.post("/players/bulk", data),
};

export const matchAPI = {
  getMatches: (params) => api.get("/matches", { params }),
  getMatch: (id) => api.get(`/matches/${id}`),
  createMatch: (data) => api.post("/matches", data),
  updateMatch: (id, data) => api.put(`/matches/${id}`, data),
  updateLineup: (id, data) => api.put(`/matches/${id}/lineup`, data),
  uploadMatchEvents: (id, events) =>
    api.post(`/matches/${id}/events`, { events }),
  uploadMatchVideo: (id, formData) =>
    api.post(`/matches/${id}/video`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadEventData: (id, formData) =>
    api.post(`/matches/${id}/events/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getMatchTimeline: (id) => api.get(`/matches/${id}/timeline`),
  getNetworkAnalysis: (id, params) =>
    api.get(`/matches/${id}/network`, { params }),
  getRecentMatches: (limit) =>
    api.get("/matches/recent", { params: { limit } }),
};

export const analyticsAPI = {
  getPlayerHeatmap: (id, params) =>
    api.get(`/analytics/players/${id}/heatmap`, { params }),
  getTeamPerformance: (id, params) =>
    api.get(`/analytics/teams/${id}/performance`, { params }),
  getPlayerComparison: (params) =>
    api.get("/analytics/players/compare", { params }),
  getDashboardStats: () => api.get("/analytics/dashboard/stats"),
  updatePlayerRankings: () => api.post("/analytics/players/update-rankings"),
};

export const clubAPI = {
  getClubs: (params) => api.get("/clubs", { params }),
  getClub: (id) => api.get(`/clubs/${id}`),
  createClub: (data) => api.post("/clubs", data),
  updateClub: (id, data) => api.put(`/clubs/${id}`, data),
};

export const tournamentAPI = {
  getTournaments: (params) => api.get("/tournaments", { params }),
  getTournament: (id) => api.get(`/tournaments/${id}`),
  createTournament: (data) => api.post("/tournaments", data),
  updateTournament: (id, data) => api.put(`/tournaments/${id}`, data),
};

export const uploadAPI = {
  generatePresignedUrl: (data) => api.post("/upload/presigned-url", data),
  uploadFile: (formData) =>
    api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadMultiple: (formData) =>
    api.post("/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteFile: (key) => api.delete(`/upload/${key}`),
};

export const adminAPI = {
  getUsers: (params) => api.get("/admin/users", { params }),
  getUserStats: () => api.get("/admin/users/stats"),
  deactivateUser: (id) => api.patch(`/admin/users/${id}/deactivate`),
  activateUser: (id) => api.patch(`/admin/users/${id}/activate`),
  getHealth: () => api.get("/admin/health"),
};

// Health check
export const healthCheck = () => api.get("/health");

export default api;
