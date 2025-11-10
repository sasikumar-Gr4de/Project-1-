import api from "@/services/base.api";

export const passportService = {
  // Passport
  getPlayerPassport: () => api.get(`/passport/v1/player/passport`),

  updatePlayerPassport: (data) => api.put(`/passport/v1/player/passport`, data),

  uploadPassportFiles: (data) =>
    api.post(`/passport/v1/player/passport/files`, data),

  getVerificationStatus: () => api.get(`/passport/v1/player/passport/status`),

  createShareLink: (data) =>
    api.post(`/passport/v1/player/passport/share/create`, data),

  revokeShareLink: (data) =>
    api.post(`/passport/v1/player/passport/share/revoke`, data),

  getPublicPassport: (token) =>
    api.get(`/passport/v1/player/passport/public/${token}`),

  // Metrics
  ingestPlayerMetrics: (playerId, metricsData) =>
    api.post(`/passport/players/${playerId}/metrics`, metricsData),

  getPlayerMetrics: (playerId, params = {}) =>
    api.get(`/passport/players/${playerId}/metrics`, { params }),

  // Admin endpoints
  getPendingVerifications: (params = {}) =>
    api.get("/verifications/pending", { params }),

  reviewVerification: (verificationId, reviewData) =>
    api.post(`/verifications/${verificationId}/review`, reviewData),

  restartVerification: () =>
    api.post(`/passport/v1/player/verifications/restart`),
};
