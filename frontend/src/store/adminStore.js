import { create } from "zustand";
import { adminService } from "@/services/admin.service";

export const useAdminStore = create((set, get) => ({
  // State
  metrics: null,
  queue: { items: [], pagination: {} },
  users: { items: [], pagination: {} },
  reports: { items: [], pagination: {} },
  isLoading: false,
  error: null,
  filters: {
    status: "all",
    dateRange: "7d",
    search: "",
  },

  // Actions
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // System Metrics
  fetchSystemMetrics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getSystemMetrics();
      set({ metrics: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Queue Management
  fetchQueue: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getProcessingQueue(filters);
      console.log("Fetched Queue:", response.data);
      window.alert("Fetched Queue: " + JSON.stringify(response.data));
      set({ queue: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  retryJob: async (jobId) => {
    try {
      await adminService.retryJob(jobId);
      const queue = get().queue;
      const updatedItems = queue.items.map((item) =>
        item.id === jobId ? { ...item, status: "pending" } : item
      );
      set({ queue: { ...queue, items: updatedItems } });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteJob: async (jobId) => {
    try {
      await adminService.deleteJob(jobId);
      const queue = get().queue;
      const updatedItems = queue.items.filter((item) => item.id !== jobId);
      set({ queue: { ...queue, items: updatedItems } });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // User Management
  fetchUsers: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getUsers(params);
      set({ users: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, status);
      const users = get().users;
      const updatedItems = users.items.map((user) =>
        user.id === userId ? { ...user, status } : user
      );
      set({ users: { ...users, items: updatedItems } });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Report Management
  fetchReports: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getReports(params);
      set({ reports: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteReport: async (reportId) => {
    try {
      await adminService.deleteReport(reportId);
      const reports = get().reports;
      const updatedItems = reports.items.filter((item) => item.id !== reportId);
      set({ reports: { ...reports, items: updatedItems } });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  regenerateReport: async (reportId) => {
    try {
      await adminService.regenerateReport(reportId);
      const reports = get().reports;
      const updatedItems = reports.items.map((item) =>
        item.id === reportId ? { ...item, status: "generating" } : item
      );
      set({ reports: { ...reports, items: updatedItems } });
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  fetchSystemAnalytics: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminService.getSystemAnalytics(params);
      set({ analytics: response.data, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
