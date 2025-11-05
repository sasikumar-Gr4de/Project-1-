import api from "@/services/base.api";

export const passportService = {
  // Passport
  getPlayerPassport: (playerId) =>
    api.get(`/passport/players/${playerId}/passport`),

  // Identity
  updatePlayerIdentity: (playerId, identityData) =>
    api.post(`/passport/players/${playerId}/identity`, identityData),

  uploadHeadshot: (playerId, headshotUrl) =>
    api.patch(`/passport/players/${playerId}/headshot`, {
      headshot_url: headshotUrl,
    }),

  // Verification
  getVerificationStatus: (playerId) =>
    api.get(`/passport/players/${playerId}/verifications`),

  uploadVerification: (playerId, documentData) =>
    api.post(`/passport/players/${playerId}/verifications`, documentData),

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
};
