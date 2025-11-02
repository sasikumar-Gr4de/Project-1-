import api from "@/services/base.api";

export const adminService = {
  // System Metrics
  async getSystemMetrics() {
    const response = await api.get("/admin/metrics");
    return response.data;
  },

  // Queue Management (using player_data table)
  async getProcessingQueue(filters = {}) {
    const response = await api.get("/admin/queue", { params: filters });
    return response.data;
  },

  async retryJob(jobId) {
    const response = await api.post(`/admin/queue/${jobId}/retry`);
    return response.data;
  },

  async deleteJob(jobId) {
    const response = await api.delete(`/admin/queue/${jobId}`);
    return response.data;
  },

  // User Management
  async getUsers(params = {}) {
    const response = await api.get("/admin/users", { params });
    return response.data;
  },

  async updateUserStatus(userId, status) {
    const response = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return response.data;
  },

  async getUserDetails(userId) {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Report Management
  async getReports(params = {}) {
    const response = await api.get("/admin/reports", { params });
    return response.data;
  },

  async deleteReport(reportId) {
    const response = await api.delete(`/admin/reports/${reportId}`);
    return response.data;
  },

  async regenerateReport(reportId) {
    const response = await api.post(`/admin/reports/${reportId}/regenerate`);
    return response.data;
  },

  async getSystemAnalytics() {
    const response = await api.get("/admin/analytics");
    return response.data;
  },
};
