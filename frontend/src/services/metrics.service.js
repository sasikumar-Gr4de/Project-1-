import api from "./base.api";

export const metricsService = {
  // Batch process metrics
  processBatch: (batchData) => api.post("/metrics/batch", batchData),

  // Get player timeline
  getPlayerTimeline: (playerId, params = {}) =>
    api.get(`/metrics/players/${playerId}/timeline`, { params }),

  // Export metrics
  exportMetrics: (playerId, format = "csv") =>
    api.get(`/metrics/players/${playerId}/export`, {
      params: { format },
      responseType: "blob",
    }),
};
