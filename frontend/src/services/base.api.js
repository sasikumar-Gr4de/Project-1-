import { API_BASE_URL } from "../utils/constants";
import { useAuthStore } from "../store/authStore";

class BaseAPI {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = useAuthStore.getState().token;

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body && config.headers["Content-Type"] === "application/json") {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Auth API
export const authAPI = {
  sendOtp: (data) => new BaseAPI().post("/auth/send-otp", data),
  verifyOtp: (data) => new BaseAPI().post("/auth/verify-otp", data),
  getCurrentUser: () => new BaseAPI().get("/auth/me"),
  logout: () => new BaseAPI().post("/auth/logout"),
  updateProfile: (data) => new BaseAPI().patch("/users/profile", data),
};

// User API
export const userAPI = {
  getDashboard: () => new BaseAPI().get("/users/dashboard"),
  getReports: (page = 1, limit = 10) =>
    new BaseAPI().get(`/users/reports?page=${page}&limit=${limit}`),
  getReport: (reportId) => new BaseAPI().get(`/users/reports/${reportId}`),
};

// Upload API
export const uploadAPI = {
  uploadData: (formData) => {
    const baseAPI = new BaseAPI();
    return baseAPI.request("/upload/data", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
      body: formData,
    });
  },
};

// Subscription API
export const subscriptionAPI = {
  createCheckoutSession: (data) =>
    new BaseAPI().post("/subscriptions/create-checkout-session", data),
  getCurrentSubscription: () => new BaseAPI().get("/subscriptions/current"),
};

// Admin API
export const adminAPI = {
  getQueue: (status, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return new BaseAPI().get(`/admin/queue?${params}`);
  },
  getSystemMetrics: () => new BaseAPI().get("/admin/metrics"),
  updateScoringWeights: (data) =>
    new BaseAPI().patch("/admin/scoring-weights", data),
};

export default BaseAPI;
