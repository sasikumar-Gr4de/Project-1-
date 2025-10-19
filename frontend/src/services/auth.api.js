import api from "@/services/base.api";

export const AuthApiService = {
  // User authentication
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),

  // User profile management
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (userData) => api.put("/auth/profile", userData),
  logout: () => api.post("/auth/logout"),
  refreshToken: () => refreshToken(),
  requestPasswordReset: (email) => api.post("/auth/password-reset", { email }),

  verifyEmail: (token) => api.post("/auth/verify-email", { token }),
  resendVerification: (email) =>
    api.post("/auth/resend-verification", { email }),
  checkVerificationStatus: () => api.get("/auth/verification-status"),
};
