// userStore.js
import { create } from "zustand";
import api from "@/services/base.api";
import { subscriptionService } from "@/services/subscription.service";

// Create user API methods using the axios instance
const userAPI = {
  getDashboard: () => api.get("/users/dashboard"),
  getReports: (page = 1, limit = 10) =>
    api.get(`/users/reports?page=${page}&limit=${limit}`),
  getReport: (reportId) => api.get(`/users/reports/${reportId}`),
};

export const useUserStore = create((set, get) => ({
  // State
  dashboardData: null,
  reports: [],
  currentReport: null,
  subscription: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Subscription Actions
  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await subscriptionService.getSubscription();
      if (response.success) {
        set({
          subscription: response.data,
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch subscription",
        isLoading: false,
      });
      throw error;
    }
  },

  syncSubscription: async () => {
    try {
      const response = await subscriptionService.syncSubscription();
      if (response.success) {
        set({
          subscription: response.data,
        });
        return response.data;
      }
    } catch (error) {
      console.error("Failed to sync subscription:", error);
      throw error;
    }
  },

  setSubscription: (subscription) => set({ subscription }),

  // Check feature access
  checkFeatureAccess: async (feature) => {
    try {
      const response = await subscriptionService.checkAccess(feature);
      return response.data;
    } catch (error) {
      console.error("Failed to check feature access:", error);
      return { hasAccess: false, reason: "Error checking access" };
    }
  },

  // Get Dashboard Data
  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getDashboard();
      if (response.data.success) {
        set({
          dashboardData: response.data.data,
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch dashboard data",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Reports with Pagination
  fetchReports: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getReports(page, limit);
      if (response.data.success) {
        set({
          reports: response.data.data.reports || [],
          pagination: {
            page: response.data.data.pagination?.page || page,
            pageSize: response.data.data.pagination?.pageSize || limit,
            total: response.data.data.pagination?.total || 0,
            totalPages: response.data.data.pagination?.totalPages || 0,
          },
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch reports",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Single Report
  fetchReport: async (reportId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await userAPI.getReport(reportId);
      if (response.data.success) {
        set({
          currentReport: response.data.data,
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch report",
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear current report
  clearCurrentReport: () => set({ currentReport: null }),

  // Update pagination
  setPagination: (pagination) =>
    set({
      pagination: { ...get().pagination, ...pagination },
    }),

  // Reset store
  reset: () =>
    set({
      dashboardData: null,
      reports: [],
      currentReport: null,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      isLoading: false,
      error: null,
    }),
}));
