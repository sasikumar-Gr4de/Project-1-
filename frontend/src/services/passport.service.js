import api from "@/services/base.api";

export const passportService = {
  // Get complete passport
  getPlayerPassport: (playerId) =>
    api.get(`/passport/players/${playerId}/passport`),

  // Update identity
  updatePlayerIdentity: (playerId, identityData) =>
    api.patch(`/passport/players/${playerId}/identity`, identityData),

  // Ingest metrics
  ingestPlayerMetrics: (playerId, metricsData) =>
    api.post(`/passport/players/${playerId}/metrics`, metricsData),

  // Get metrics
  getPlayerMetrics: (playerId, params = {}) =>
    api.get(`/passport/players/${playerId}/metrics`, { params }),

  // Get metrics summary
  getMetricsSummary: (playerId, period = "4weeks") =>
    api.get(`/passport/players/${playerId}/metrics/summary`, {
      params: { period },
    }),

  // Upload verification
  uploadVerification: (playerId, documentData) =>
    api.post(`/passport/players/${playerId}/verifications`, documentData),

  // Admin verification endpoints
  getPendingVerifications: (params = {}) =>
    api.get("/verifications/pending", { params }),

  reviewVerification: (verificationId, reviewData) =>
    api.post(
      `/verifications/${verificationId}/review`,
      reviewData
    ),

  getVerificationStats: () => api.get("/verifications/stats"),
};
