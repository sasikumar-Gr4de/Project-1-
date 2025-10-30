// adminStore.js
import { create } from "zustand";
import api from "@/services/base.api";

// Create admin API methods using the axios instance
const adminAPI = {
  getSystemMetrics: () => api.get("/admin/metrics"),
  getQueue: (status = "pending", page = 1, limit = 10) =>
    api.get(`/admin/queue?status=${status}&page=${page}&limit=${limit}`),
  getUsers: (page = 1, limit = 10) =>
    api.get(`/admin/users?page=${page}&limit=${limit}`),
  getReports: (page = 1, limit = 10) =>
    api.get(`/admin/reports?page=${page}&limit=${limit}`),
};

export const useAdminStore = create((set, get) => ({
  // State
  metrics: null,
  queue: [],
  users: [],
  reports: [],
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

  // Get System Metrics
  fetchSystemMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getSystemMetrics();
      if (response.data.success) {
        set({
          metrics: response.data.data,
          isLoading: false,
        });
        return response.data;
      }
    } catch (error) {
      set({
        error:
          error.response?.data?.message || "Failed to fetch system metrics",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Queue Items
  fetchQueue: async (status = "pending", page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getQueue(status, page, limit);
      if (response.data.success) {
        set({
          queue: response.data.data.queue || [],
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
        error: error.response?.data?.message || "Failed to fetch queue",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Users
  fetchUsers: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getUsers(page, limit);
      if (response.data.success) {
        set({
          users: response.data.data.users || [],
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
        error: error.response?.data?.message || "Failed to fetch users",
        isLoading: false,
      });
      throw error;
    }
  },

  // Get Reports
  fetchReports: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getReports(page, limit);
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

  // Update pagination
  setPagination: (pagination) =>
    set({
      pagination: { ...get().pagination, ...pagination },
    }),

  // Reset store
  reset: () =>
    set({
      metrics: null,
      queue: [],
      users: [],
      reports: [],
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
